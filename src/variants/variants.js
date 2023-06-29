export const list = {
    hidden: {
      opacity: 0, 
      transition: {
        when: 'afterChildren',
      }
    }, 
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
      }
    }
}
  
export const item = {
    hidden: i => ({
      opacity: 0, 
      y:-10,
      transition: {
        duration: 1,
        delay: i * .05
      }
    }), 
    visible: i => ({
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1,
        delay: i * .05
      }
    })
}
  
export const loadingIcon = {
    visible: {
      opacity: 1,
      rotateZ: 360, 
      transition: {
        ease: 'linear',
        duration: 1,
        repeat: Infinity
      }
    }
}