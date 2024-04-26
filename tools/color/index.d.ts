interface ColorTools {
  setElementTheme(
    themeColor: string,
    varType: string,
    lightLevelList?: number[],
    darkLevelList?: number[]
  ): void;
}
declare let color: ColorTools
export default color
