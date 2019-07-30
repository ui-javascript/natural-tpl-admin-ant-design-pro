import { Route } from '@/components/SiderMenu';
import { GeographicModelState } from '@/pages/Account/Settings/models/geographic';
import { ActivitiesModelState } from '@/pages/Dashboard/models/activities';
import { ChartModelState } from '@/pages/Dashboard/models/chart';
import { MonitorModelState } from '@/pages/Dashboard/models/monitor';
import { FormModelState } from '@/pages/Forms/models/form';
import { RuleModelState } from '@/pages/List/models/rule';
import { ProfileModelState } from '@/pages/Profile/models/profile';
import { RegisterModelState } from '@/pages/User/models/register';
import { EffectsCommandMap } from 'dva';
import { match } from 'react-router-dom';
import { AnyAction } from 'redux';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { ListModelState } from './list';
import { LoginModelState } from './login';
import { MenuModelState } from './menu';
import { ProjectModelState } from './project';
import { SettingModelState } from './setting';
import { UserModelState } from './user';

export {
  GeographicModelState,
  ActivitiesModelState,
  ChartModelState,
  MonitorModelState,
  FormModelState,
  RuleModelState,
  ProfileModelState,
  RegisterModelState,
  GlobalModelState,
  ListModelState,
  LoginModelState,
  MenuModelState,
  ProjectModelState,
  SettingModelState,
  UserModelState,
};

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    activities?: boolean;
    chart?: boolean;
    form?: boolean;
    geographic?: boolean;
    global?: boolean;
    list?: boolean;
    login?: boolean;
    menu?: boolean;
    monitor?: boolean;
    profile?: boolean;
    project?: boolean;
    register?: boolean;
    rule?: boolean;
    setting?: boolean;
    user?: boolean;
  };
}

export interface ConnectState {
  activities?: ActivitiesModelState;
  chart?: ChartModelState;
  form?: FormModelState;
  geographic?: GeographicModelState;
  global: GlobalModelState;
  list: ListModelState;
  login: LoginModelState;
  loading: Loading;
  menu: MenuModelState;
  monitor?: MonitorModelState;
  profile?: ProfileModelState;
  project: ProjectModelState;
  register?: RegisterModelState;
  rule?: RuleModelState;
  setting: SettingModelState;
  user: UserModelState;
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<P extends { [K in keyof P]?: string } = {}>
  extends Partial<RouterTypes<Route>> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
}

export default ConnectState;
