import { Suspense } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Login from './login';
import Register from './register';

const AuthRoutes = () => {
  const { path } = useRouteMatch();

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
