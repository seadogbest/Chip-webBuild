export const chipFunctionCategories = [
  {
    key: "power",
    title: "功率类芯片",
    summary: "覆盖功率器件、功率模块和高压能量变换相关芯片。"
  },
  {
    key: "analog-power-driver",
    title: "模拟电源驱动类芯片",
    summary: "覆盖模拟前端、电源管理、栅极驱动和接口驱动类芯片。"
  },
  {
    key: "memory",
    title: "存储类芯片",
    summary: "覆盖 EEPROM、Flash、DRAM、NAND 等存储器件。"
  },
  {
    key: "communication",
    title: "通信类芯片",
    summary: "覆盖 CAN、LIN、以太网、无线连接和数据链路芯片。"
  },
  {
    key: "control",
    title: "控制类芯片",
    summary: "覆盖 MCU、PMIC 控制器、车身与动力控制相关芯片。"
  },
  {
    key: "perception",
    title: "感知类芯片",
    summary: "覆盖雷达、视觉、位置、电流、电压和环境感知芯片。"
  },
  {
    key: "computing",
    title: "计算类芯片",
    summary: "覆盖 AI 计算、座舱计算、域控 SoC 和高性能处理器。"
  }
];

// 预留给 Excel 导入后的芯片数据库记录。
// 字段设计对应 README 中描述的 6 列信息。
export const chipRecords = [];

const categoryLookup = new Map(
  chipFunctionCategories.flatMap((category) => [
    [category.key, category.key],
    [category.title, category.key]
  ])
);

export function resolveChipCategoryKey(value) {
  return categoryLookup.get(value) ?? "";
}

export function getChipCategoryStats() {
  return chipFunctionCategories.map((category) => {
    const categoryRecords = chipRecords.filter(
      (record) => resolveChipCategoryKey(record.primaryCategory) === category.key
    );
    const secondaryCategoryCount = new Set(
      categoryRecords.map((record) => record.secondaryCategory).filter(Boolean)
    ).size;

    return {
      ...category,
      chipCount: categoryRecords.length,
      secondaryCategoryCount
    };
  });
}

export function getChipRecordsByCategory(categoryKey) {
  return chipRecords.filter((record) => resolveChipCategoryKey(record.primaryCategory) === categoryKey);
}
