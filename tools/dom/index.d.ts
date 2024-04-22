interface DomUtil {
  hasClass(element: Element, classname: string): boolean;
  addClass(element: Element, classname: string): void;
  removeClass(element: Element, classname: string): void;
}
declare let dom: DomUtil
export default dom
