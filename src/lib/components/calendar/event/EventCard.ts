export function longpress(node, threshold = 500) {
    let timeout;

    const handle_mousedown = () => {
      clearTimeout(timeout); 
      let start = Date.now();

      timeout = setTimeout(() => {
        node.dispatchEvent(new CustomEvent('longpress'));
      }, threshold);

      const cancel = () => {
        clearTimeout(timeout);
        node.removeEventListener('mousemove', cancel);
        node.removeEventListener('mouseup', cancel);
        node.removeEventListener('mouseleave', cancel); 
        node.removeEventListener('touchmove', cancel); 
        node.removeEventListener('touchend', cancel);  
        node.removeEventListener('touchcancel', cancel); 
      };

      node.addEventListener('mousemove', cancel);
      node.addEventListener('mouseup', cancel);
      node.addEventListener('mouseleave', cancel); 
      node.addEventListener('touchmove', cancel); 
      node.addEventListener('touchend', cancel);  
      node.addEventListener('touchcancel', cancel); 
    };

    node.addEventListener('mousedown', handle_mousedown);
    node.addEventListener('touchstart', handle_mousedown);

    return {
      destroy() {
        node.removeEventListener('mousedown', handle_mousedown);
        node.removeEventListener('touchstart', handle_mousedown);
      }
    };
}