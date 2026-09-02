# 词库文件

这些 JSON 由 [ECDICT](https://github.com/skywind3000/ECDICT)（MIT License）生成，
按考试大纲标签分级，并按词频（BNC / 当代语料）从高到低排序。

| 文件 | 词书 | 词数 |
| --- | --- | --- |
| `zk.json` | 中考词汇 | 1601 |
| `gk.json` | 高考词汇 | 3674 |
| `cet4.json` | 大学英语四级 | 3846 |
| `cet6.json` | 大学英语六级 | 5406 |
| `ky.json` | 考研英语核心 | 4801 |
| `ielts.json` | 雅思 IELTS | 5040 |
| `toefl.json` | 托福 TOEFL | 6974 |
| `gre.json` | GRE 核心词汇 | 7504 |

格式：

```json
{
  "name": "英语 · 大学英语四级",
  "lang": "en",
  "words": [
    { "id": "0", "word": "government", "phonetic": "/'gʌvәnmәnt/", "pos": "n.", "translation": "政府, 内阁" }
  ]
}
```

应用会按 `wordbooks/<file>` → jsDelivr → raw.githubusercontent 的顺序加载，
首次加载后写入 localStorage，之后离线也能用。

自己做词书时，把同样结构的 JSON 通过「词书管理 → 从文件导入」导入即可，
`translation` 以外的字段都是可选的。
