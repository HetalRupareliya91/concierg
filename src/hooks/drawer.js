const Reducer = (state, action)=>{
  switch(action.type){
    case 'DRAWER_STATE':
      return{
        ...state,
        drawerOpen: action.open
      };
    case 'DRAWER_SUB_MENU':
      return{
        ...state,
        submenuOpen: action.open
      };
    case 'CLOSE_SUB_MENU':
      return{
        ...state,
        closeSubmenu: action.close
      };
      default: return state;
  }
}

export default Reducer;