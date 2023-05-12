import {
  API_NAME_SPACE,
  API_PROXY_SUFFIX,
  MOCK_DOMAIN_PREFIX,
} from './constants'
import { ifStarMock, ifStartPartMock } from './util'

/**
 * 控制加载 MSW mock 拦截
 * @returns
 */
export const loadMswProxy = () => {
  if (!ifStarMock()) {
    return
  }
  if (ifStartPartMock()) {
    console.log(
      `part mock start: 拦截部分接口，请给接口url上附着 ${API_PROXY_SUFFIX} 参数，如：/api/list-table?${API_PROXY_SUFFIX}`,
      `该 url 将会被附加前缀 ${MOCK_DOMAIN_PREFIX} 并被msw拦截，如：${MOCK_DOMAIN_PREFIX}/${API_NAME_SPACE}/api/list-table?${API_PROXY_SUFFIX}`,
    )
  } else {
    console.log(`mock proxy start: 默认拦截所有 /${API_NAME_SPACE} 开头的 url`)
  }

  import('./browser')
    .then(({ worker }) => {
      worker.start()
      console.log('mock load success')
    })
    .catch(e => {
      console.warn('mock load fail', e)
    })
}
