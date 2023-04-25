import * as React from 'react';
import { ReactNode, createContext, useContext } from 'react';

type PropsCreateProviderContext<V, P> = {
  readonly useHook: (props?: P) => V;
  readonly props?: P;
};
export const createProviderContext = <V, P = {}>({
  useHook,
  props: hookProps,
}: PropsCreateProviderContext<V, P>) => {
  const Context = createContext<V | null>(null);

  type PropsProvider = {
    readonly children: ReactNode;
  } & P;
  const Provider = ({ children, ...providerProps }: PropsProvider) => {
    const props: any =
      !hookProps && !providerProps
        ? hookProps
        : { ...hookProps, ...providerProps };

    const value = useHook(props);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useHookContext = () => {
    const context = useContext(Context);

    if (context === null) {
      throw new Error(`useHookContext needs to be a child of <Provider />`);
    }

    return context;
  };

  return { Provider, useHookContext };
};
