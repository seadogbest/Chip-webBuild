import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path
from typing import Dict, List, Tuple

ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_INPUT_CANDIDATES = [
    ROOT_DIR / "src" / "data" / "data.xlsx",
    ROOT_DIR / "src" / "data" / "chip.xlsx",
]
OUTPUT_PATH = ROOT_DIR / "src" / "data" / "chip-records.generated.js"
XML_NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def resolve_input_path() -> Path:
    if len(sys.argv) > 1:
        custom_path = Path(sys.argv[1])
        if not custom_path.is_absolute():
            custom_path = ROOT_DIR / custom_path
        return custom_path

    for candidate in DEFAULT_INPUT_CANDIDATES:
        if candidate.exists():
            return candidate

    return DEFAULT_INPUT_CANDIDATES[0]


def col_to_num(column_name: str) -> int:
    value = 0
    for char in column_name:
        if char.isalpha():
            value = value * 26 + ord(char.upper()) - 64
    return value


def parse_xlsx_rows(file_path: Path) -> List[List[str]]:
    with zipfile.ZipFile(file_path) as archive:
        shared_strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for string_item in root.findall("a:si", XML_NS):
                shared_strings.append("".join((text.text or "") for text in string_item.findall(".//a:t", XML_NS)))

        rels_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {item.attrib["Id"]: item.attrib["Target"] for item in rels_root}

        workbook_root = ET.fromstring(archive.read("xl/workbook.xml"))
        first_sheet = workbook_root.find("a:sheets/a:sheet", XML_NS)
        if first_sheet is None:
            return []

        target = rel_map[first_sheet.attrib[REL_NS]].lstrip("/")
        if not target.startswith("xl/"):
            target = f"xl/{target.lstrip('./')}"

        worksheet_root = ET.fromstring(archive.read(target))
        rows = []
        for row in worksheet_root.findall(".//a:sheetData/a:row", XML_NS):
            values = {}
            for cell in row.findall("a:c", XML_NS):
                reference = cell.attrib.get("r", "")
                match = re.match(r"([A-Z]+)", reference)
                column_index = col_to_num(match.group(1)) if match else None
                if column_index is None:
                    continue

                cell_type = cell.attrib.get("t")
                value_node = cell.find("a:v", XML_NS)
                cell_value = ""
                if cell_type == "s" and value_node is not None:
                    cell_value = shared_strings[int(value_node.text)]
                elif cell_type == "inlineStr":
                    cell_value = "".join((text.text or "") for text in cell.findall(".//a:t", XML_NS))
                elif value_node is not None:
                    cell_value = value_node.text or ""

                values[column_index] = cell_value.strip()

            if values:
                rows.append([values.get(index, "") for index in range(1, max(values) + 1)])

        return rows


def slugify(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    return normalized.strip("-") or "chip"


def normalize_datasheet(raw_value: str) -> Tuple[str, str]:
    cleaned = raw_value.strip()
    if re.match(r"^https?://", cleaned, re.IGNORECASE):
        return cleaned, ""
    if cleaned:
        return "", "待芯片原厂补充"
    return "", "待芯片原厂补充"


def build_records(rows: List[List[str]]) -> List[Dict[str, str]]:
    records = []
    for index, row in enumerate(rows[2:], start=1):
        row = row + [""] * (6 - len(row))
        _, model, manufacturer, primary_category, secondary_category, datasheet = row[:6]
        if not any([model, manufacturer, primary_category, secondary_category, datasheet]):
            continue

        datasheet_url, datasheet_note = normalize_datasheet(datasheet)
        record = {
            "id": f"{slugify(primary_category)}-{slugify(secondary_category)}-{slugify(model)}-{index}",
            "model": model,
            "manufacturer": manufacturer,
            "primaryCategory": primary_category,
            "secondaryCategory": secondary_category,
            "datasheetUrl": datasheet_url,
            "datasheetNote": datasheet_note,
        }
        records.append(record)

    return records


def write_output(records: List[Dict[str, str]]) -> None:
    OUTPUT_PATH.write_text(
        "export const chipRecords = " + json.dumps(records, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )


def main() -> int:
    input_path = resolve_input_path()
    if not input_path.exists():
        print(f"[import-chip-data] 未找到 Excel 文件: {input_path}")
        print("[import-chip-data] 默认会尝试读取 src/data/data.xlsx 或 src/data/chip.xlsx")
        return 1

    rows = parse_xlsx_rows(input_path)
    records = build_records(rows)
    write_output(records)

    print(f"[import-chip-data] 输入文件: {input_path.relative_to(ROOT_DIR)}")
    print(f"[import-chip-data] 输出文件: {OUTPUT_PATH.relative_to(ROOT_DIR)}")
    print(f"[import-chip-data] 已生成芯片记录: {len(records)} 条")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
