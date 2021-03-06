/*
 * Copyright 2018-19 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Common, CLI, Selectors, ReplExpect } from '@kui-shell/test'
import { createNS, allocateNS, doHelp } from '../../../tests/lib/k8s/utils'

import * as assert from 'assert'

const commonModes = ['Introduction', 'Options']
const kubectlApiResourcesModes = commonModes.concat(['api-resources'])

describe('kubectl api-resources', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  it('should get a list of api resources', () =>
    CLI.command('kubectl api-resources', this.app)
      .then(async res => {
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('bindings') })(res)
        const actualTitle = await this.app.client.getText(Selectors.TABLE_TITLE(res.count))
        assert.strictEqual(actualTitle, 'Api-resources')
      })
      .catch(Common.oops(this, true)))

  it('should get a list of api resources', () =>
    CLI.command('kubectl api-resources --namespaced=true', this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('bindings') }))
      .catch(Common.oops(this, true)))

  it('should get a list of api resources', () =>
    CLI.command('kubectl api-resources --api-group=extensions', this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('daemonsets') }))
      .catch(Common.oops(this, true)))

  const help = doHelp.bind(this)
  help('kubectl api-resources -h', ['kubectl', 'api-resources'], kubectlApiResourcesModes)
})
