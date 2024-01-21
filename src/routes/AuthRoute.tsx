/* eslint-disable @typescript-eslint/no-explicit-any */

import { Route, Redirect } from 'react-router-dom';
import { getToken } from '@/shared/utils/utils';

const AuthRoute = ({ component: Component, ...rest }: any) => {
  const token = getToken();

  return token ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
  ) : (
    <Redirect to="/auth/login" />
  );
};

export default AuthRoute;
