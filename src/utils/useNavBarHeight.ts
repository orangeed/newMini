import { provide, inject, ref, type Ref } from 'vue';

const NavBarContextSymbol = Symbol('NavBarContext');

export interface NavBarContext {
  statusBarHeight: Ref<number>;
  navBarHeight: Ref<number>;
  totalHeight: Ref<number>;
}

export function createNavBarContext() {
  const statusBarHeight = ref(20);
  const navBarHeight = ref(44);
  const totalHeight = ref(64);

  try {
    const sysInfo = uni.getSystemInfoSync();
    const menuButton = uni.getMenuButtonBoundingClientRect();

    statusBarHeight.value = sysInfo.statusBarHeight || 20;
    navBarHeight.value = menuButton.bottom + menuButton.top - statusBarHeight.value;
    totalHeight.value = statusBarHeight.value + navBarHeight.value;
  } catch (e) {
    console.warn('获取导航栏高度失败，使用默认值');
  }

  const context: NavBarContext = {
    statusBarHeight,
    navBarHeight,
    totalHeight,
  };

  provide(NavBarContextSymbol, context);

  return context;
}

export function useNavBarContext(): NavBarContext {
  const context = inject<NavBarContext>(NavBarContextSymbol);
  if (!context) {
    throw new Error('NavBarContext 未提供，请在 App.vue 或页面中调用 createNavBarContext()');
  }
  return context;
}
