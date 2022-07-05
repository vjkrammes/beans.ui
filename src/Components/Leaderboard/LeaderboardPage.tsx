import { useState, useEffect } from 'react';
import {
  ColumnsDirective,
  ColumnDirective,
  GridComponent,
  Inject,
  Page,
  Sort,
} from '@syncfusion/ej2-react-grids';
import { ILeaderboardEntry } from '../../Interfaces/ILeaderboardEntry';
import { getLeaderboard } from '../../Services/UserService';
import { toSignedCurrency } from '../../Services/tools';
import GainLossBadge from '../Widgets/Badges/GainLossBadge';
import PageHeader from '../Widgets/Page/PageHeader';
import Spinner from '../Widgets/Spinner/Spinner';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<ILeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function doLoadEntries() {
      setLoading(true);
      const e = await getLeaderboard();
      setEntries(e);
      setLoading(false);
    }
    doLoadEntries();
  }, []);
  function gainTemplate(props: ILeaderboardEntry) {
    return <span>{toSignedCurrency(props.gainOrLoss)}</span>;
  }
  function salesGainTemplate(props: ILeaderboardEntry) {
    return <span>{toSignedCurrency(props.salesGainOrLoss)}</span>;
  }
  function makeChangeTemplate(value: number) {
    return (
      <GainLossBadge
        value={value}
        decimals={2}
        greenColor="var(--green4)"
        redColor="var(--red3)"
        postfix="%"
      />
    );
  }
  function changeTemplate(props: ILeaderboardEntry) {
    return makeChangeTemplate(props.change);
  }
  function salesChangeTemplate(props: ILeaderboardEntry) {
    return makeChangeTemplate(props.salesChange);
  }
  function scoreTemplate(props: ILeaderboardEntry) {
    return props.score.toFixed(4);
  }
  return (
    <div className="container">
      <PageHeader heading="Leaderboard" showHomeButton={true} />
      {loading && (
        <div className="loading">
          <Spinner /> Loading ...
        </div>
      )}
      {!loading && (
        <div className="content">
          {(!entries || entries.length === 0) && (
            <div className="noitemsfound">No Leaderboard Entries</div>
          )}
          {entries && entries.length > 0 && (
            <>
              <div className="lp__boardlarge">
                <GridComponent
                  title="Leaderboard"
                  id="lb__grid"
                  dataSource={entries}
                  allowPaging={true}
                  pageSettings={{ pageSize: 15 }}
                  allowSorting={true}
                  sortSettings={{
                    columns: [
                      {
                        field: 'score',
                        direction: 'Descending',
                      },
                    ],
                  }}
                >
                  <ColumnsDirective>
                    <ColumnDirective
                      width="100"
                      field="displayName"
                      headerText="User"
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="gainOrLoss"
                      headerText="Gain"
                      template={gainTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="change"
                      headerText="Change"
                      template={changeTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="salesGainOrLoss"
                      headerText="Sale Gain"
                      template={salesGainTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="salesChange"
                      headerText="Sale Change"
                      template={salesChangeTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="score"
                      headerText="Score"
                      template={scoreTemplate}
                      allowSorting={true}
                    />
                  </ColumnsDirective>
                  <Inject services={[Page, Sort]} />
                </GridComponent>
              </div>
              <div className="lp__boardsmall">
                <GridComponent
                  title="Leaderboard"
                  id="lb__grid"
                  dataSource={entries}
                  allowPaging={true}
                  pageSettings={{ pageSize: 15 }}
                  allowSorting={true}
                  sortSettings={{
                    columns: [
                      {
                        field: 'score',
                        direction: 'Descending',
                      },
                    ],
                  }}
                >
                  <ColumnsDirective>
                    <ColumnDirective
                      width="100"
                      field="displayName"
                      headerText="User"
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="change"
                      headerText="Change"
                      template={changeTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="salesChange"
                      headerText="Sale Change"
                      template={salesChangeTemplate}
                      allowSorting={true}
                    />
                    <ColumnDirective
                      width="75"
                      field="score"
                      headerText="Score"
                      template={scoreTemplate}
                      allowSorting={true}
                    />
                  </ColumnsDirective>
                  <Inject services={[Page, Sort]} />
                </GridComponent>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
