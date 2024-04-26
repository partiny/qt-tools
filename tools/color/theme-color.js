// 将颜色中转换为 [r, g, b] 数组
function getRgbList(color) {
  const type = getColorType(color)
  if (!type || !['hex', 'rgb'].includes(type)) {
    throw new Error('输入的颜色值有误')
  }
  if (type === 'hex') {
    color = color.replace('#', '')

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
    const arr = color.match(/(\d+)/g)
    return arr ? JSON.parse(JSON.stringify(arr)) : null
  }

  return null
}

// 获取字符串所属的颜色类型
function getColorType(str) {
  const regHex = new RegExp('^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$')
  const regRgb = new RegExp('^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$')
  if (!str) {
    return null
  } else if (str.match(regHex) !== null) {
    return 'hex'
  } else if (str.match(regRgb) !== null) {
    return 'rgb'
  } else {
    return null
  }
}

// 获取变深的 hex 值
function getDarken(color, level) {
  const arr = getRgbList(color)
  if (!arr) throw new Error('未获取到颜色值，请确认输入的颜色值是否有误')

  for(let i=0; i<3; i++) {
    arr[i] = Math.round(arr[i] * (1 - (level/10)))
  }

  // 转 hex
  const hex = '#' + arr.map(v => {
    const str = Number(v).toString(16)
    return str.length === 1 ? '0' + str : str
  }).join('')
  return hex.toLowerCase()
}

// 获取变浅的 hex 值
function getLighten(color, level) {
  const arr = getRgbList(color)
  if (!arr) throw new Error('未获取到颜色值，请确认输入的颜色值是否有误')

  for(let i=0; i<3; i++) {
    arr[i] = Math.round((255 - arr[i]) * (level/10) + arr[i])
  }

  // 转 hex
  const hex = '#' + arr.map(v => {
    const str = Number(v).toString(16)
    return str.length === 1 ? '0' + str : str
  }).join('')
  return hex.toLowerCase()
}

// 设置 css 变量
function setPropertyColor(
  color,
  level,
  type = 'lighten',
  varType = 'primary'
) {

  let hex = color
  if (type === 'lighten') {
    hex = getLighten(color, level)
  } else if (type === 'darken') {
    hex = getDarken(color, level)
  }

  let varName = `--el-color-${varType}`
  if (level) {
    varName += `-${type==='lighten'?'light':'dark'}-${level}`
  }
  document.documentElement.style.setProperty(varName, hex)
}

function setElementTheme(
  themeColor,
  lightLevelList,
  darkLevelList
) {
  if (!themeColor) return
  lightLevelList = lightLevelList || [3, 5, 7, 8, 9]
  darkLevelList = darkLevelList || [3, 5, 7, 8, 9]

  // 设置主颜色值，如：--el-color-primary
  setPropertyColor(themeColor, 0)

  // 设置变浅的颜色值，如：--el-color-primary-light-3
  lightLevelList.forEach((level) => {
    setPropertyColor(themeColor, level)
  })

  // 设置变深的颜色值，如：--el-color-primary-dark-2
  darkLevelList.forEach((level) => {
    setPropertyColor(themeColor, level, 'darken')
  })
}

export {
  setElementTheme
}