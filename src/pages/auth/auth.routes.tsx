import { Suspense } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import Login from './login';
import Register from './register';

import { getToken } from '@/shared/utils/utils';

const AuthRoutes = () => {
  const { path } = useRouteMatch();

  if (getToken()) {
    return <Redirect to="/" />;
  }

  return (
    <div className=''>
      <Suspense fallback={null}>
        <Switch>
          <Route path={`${path}/login`} component={Login} exact />
          <Route path={`${path}/register`} component={Register} exact />
        </Switch>
      </Suspense>
    </div>
  )
}

export default AuthRoutes;
