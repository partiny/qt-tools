/**
 * 将颜色值转换为 [r, g, b] 数组
 * @param { String } color 颜色值
 * @return { Array } rgb 数组，[r, g, b]，如 [255, 0, 0]
*/
function getRgbList(color) {
  const type = getColorType(color)
  if (!type || !['hex', 'rgb'].includes(type)) {
    throw new Error('输入的颜色值有误')
  }
  if (type === 'hex') {
    color = color.replace('#', '')
    // 3位 hex 值转为 6位的，如 #fff => #ffffff
    if (color.length === 3) {
      let newColor = ''
      for (let i=0; i<3; i++) {
        newColor += color[i] + color[i]
      }
      color = newColor
    }

    // 将颜色值拆分成 R、G、B 三个部分
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return [r, g, b]
  }
  if (type === 'rgb') {
    const arrRgb = color.match(/(\d+)/g)
    return arrRgb ? JSON.parse(JSON.stringify(arrRgb)) : null
  }

  return null
}

/**
 * 判断颜色值类型为 rgb 还是 hex
 * @param { String } color 颜色值
 * @return { String | null } 颜色值类型：rgb | hex | null
*/
function getColorType(color) {
  const regHex = new RegExp('^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$')
  const regRgb = new RegExp('^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$')

  const isHex = regHex.test(color)
  const isRgb = regRgb.test(color)

  return isHex ? 'hex' : isRgb ? 'rgb' : null
}


/**
 * 根据主色得到渐变色的 hex 颜色值
 * @param { String } mode 渐变色模式：浅色light 深色dark
 * @param { String } mainColor 主色值（rgb 或 hex 格式）
 * @param { Number } level 渐变色等级：1-10 代表 10%-100%
 * @return { String } hex 颜色值，如 #ffffff
*/
function getGradientColor(
  mode,
  mainColor,
  level
) {
  if (!['light', 'mode'].includes(mode)) {
    throw new Error('输入的颜色模式有误，可选值：light、dark')
  }
  const rgbList = getRgbList(mainColor)
  if (!rgbList) {
    throw new Error('未获取到颜色值，请确认输入的颜色值是否有误')
  }
  
  // 生成渐变色的 rgb 值
  for (let i=0; i<3; i++) {
    const item = rgbList[i]
    // 计算浅色的规则
    const lightRule = (255 - item) * (level/10) + item
    // 计算深色的规则
    const darkRule = Math.round(item * (1 - (level/10)))
    rgbList[i] = Math.round(mode === 'dark' ? darkRule : lightRule)
  }

  // rgb 转 hex
  const hex = '#' + rgbList.map(v => {
    const str = Number(v).toString(16)
    return str.length === 1 ? '0' + str : str
  }).join('')

  return hex.toLowerCase()
}

/**
 * 设置 css 变量，并绑定到 document 上
 * @param { String } mainColor 主色值（rgb 或 hex 格式）
 * @param { Number } level 渐变色等级：0-10 代表 10%-100%，0表示不需要生成后缀 '-mode-level'
 * @param { String } mode 渐变色模式：浅色light 深色dark
 * @param { String } varType css 变量类型（primary、success、info、warning、danger 等），如 primary 则表示对应 css 变量为 '--el-color-primary-xxx'
 * @return { void }
*/
function setPropertyColor(
  mainColor,
  level,
  mode,
  varType
) {
  const hex = getGradientColor(mode, mainColor, level)
  let varName = `--el-color-${varType}`
  if (level) {
    varName += `-${mode}-${level}`
  }
  document.documentElement.style.setProperty(varName, hex)
}

/**
 * 设置主题色
 * @param { String } themeColor 主题色（rgb 或 hex 格式）
 * @param { String } varType css 变量类型
 * @param { Array } lightLevelList 对应生成浅色值的等级数组，默认 [3, 5, 7, 8, 9]
 * @param { Array } darkLevelList 对应生成深色值的等级数组，默认 [2]
 * @return { void }
*/
function setElementTheme(
  themeColor,
  varType,
  lightLevelList,
  darkLevelList
) {
  if (!themeColor) return
  varType = varType || 'primary'
  lightLevelList = lightLevelList || [3, 5, 7, 8, 9]
  darkLevelList = darkLevelList || [2]

  // 设置主颜色值，如：--el-color-primary
  setPropertyColor(themeColor, 0)

  // 设置变浅的颜色值，如：--el-color-primary-light-3
  lightLevelList.forEach((level) => {
    setPropertyColor(themeColor, level, 'light', varType)
  })

  // 设置变深的颜色值，如：--el-color-primary-dark-2
  darkLevelList.forEach((level) => {
    setPropertyColor(themeColor, level, 'dark', varType)
  })
}

export {
  setElementTheme
}