/*
 (C) Copyright 2015 Hewlett Packard Enterprise Development LP

    Licensed under the Apache License, Version 2.0 (the "License"); you may
    not use this file except in compliance with the License. You may obtain
    a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
    License for the specific language governing permissions and limitations
    under the License.
*/

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { t } from 'i18n/lookup.js';
import Box from 'grommet/components/Box';
import ResponsiveBox from 'responsiveBox.jsx';
import DataGrid from 'dataGrid.jsx';
import FetchToolbar from 'fetchToolbar.jsx';


class VlanPage extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string
    }),
    vlan: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.cols = [
      {
        columnKey: 'id',
        header: t('id'),
        width: 100,
        align: 'right',
      },
      {
        columnKey: 'name',
        header: t('name'),
        flexGrow: 1,
        width: 200,
      },
    ];
    this.state = {};
  }

  _setToolbar = (props) => {
    const vlan = props.vlan;
    this.props.actions.toolbar.set(
      <FetchToolbar
          isFetching={vlan.isFetching}
          error={vlan.lastError}
          date={vlan.lastUpdate}
          onRefresh={this._onRefresh}/>
    );
  };

  componentDidMount() {
    this.props.actions.vlan.fetch();
    this._setToolbar(this.props);
  }

  _onRefresh = () => {
    this.props.actions.vlan.fetch();
  };

  componentWillReceiveProps(nextProps) {
    this._setToolbar(nextProps);
  }

  componentWillUnmount() {
    this.props.actions.toolbar.clear();
  }

  _onSelect = (id) => {
    this.props.history.pushState(null, `/vlan/${id}`);
  };

  render() {
    const vlans = this.props.vlan.entities;
    return (
      <Box direction="row" className="mLeft flex1">
        <Box className="flex1">
          <Box className="pageBox mLeft0 min200x200">
            ...BoxGraphic goes here...
          </Box>
          <ResponsiveBox>
            <DataGrid width={300} height={400}
                data={vlans}
                columns={this.cols}
                singleSelect
                onSelectChange={this._onSelect}
            />
          </ResponsiveBox>
        </Box>
        {this.props.params.id ?
          <Box className="detailPane w300 pageBox">
            Details
            {this.props.children}
          </Box> : null
        }
      </Box>
    );
  }

}

function select(store) {
  return {
    vlan: store.vlan,
  };
}

export default connect(select)(VlanPage);
