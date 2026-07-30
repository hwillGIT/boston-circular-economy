import type { Activity } from '../lib/types';
import EcoKudos from './EcoKudos';
import './ActivityTable.css';

export interface ActivityTableProps {
  activities: Activity[];
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column);
    }
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return <span className="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-table-empty">
        <div className="empty-icon">🌱</div>
        <p>No activities logged yet.</p>
        <p className="empty-subtext">Start by finding a repair option!</p>
      </div>
    );
  }

  return (
    <div className="activity-table-container">
      <table className="activity-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('date')} className={onSort ? 'sortable' : ''}>
              Date {renderSortIndicator('date')}
            </th>
            <th onClick={() => handleSort('action')} className={onSort ? 'sortable' : ''}>
              Action {renderSortIndicator('action')}
            </th>
            <th onClick={() => handleSort('item')} className={onSort ? 'sortable' : ''}>
              Item {renderSortIndicator('item')}
            </th>
            <th onClick={() => handleSort('location')} className={onSort ? 'sortable' : ''}>
              Location {renderSortIndicator('location')}
            </th>
            <th
              className={`numeric ${onSort ? 'sortable' : ''}`}
              onClick={() => handleSort('co2_saved')}
            >
              CO₂ Saved {renderSortIndicator('co2_saved')}
            </th>
            <th
              className={`numeric ${onSort ? 'sortable' : ''}`}
              onClick={() => handleSort('savings')}
            >
              Savings {renderSortIndicator('savings')}
            </th>
            <th
              className={`numeric ${onSort ? 'sortable' : ''}`}
              onClick={() => handleSort('credits')}
            >
              Credits {renderSortIndicator('credits')}
            </th>
            <th className="kudos-col">Kudos</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td className="date-cell">{new Date(activity.date).toLocaleDateString()}</td>
              <td>
                <span className={`action-badge action-${activity.action.toLowerCase()}`}>
                  {activity.action}
                </span>
              </td>
              <td className="item-cell">{activity.item}</td>
              <td className="location-cell">{activity.location_name || ''}</td>
              <td className="numeric positive">{activity.co2_saved} lbs</td>
              <td className="numeric positive">${activity.savings}</td>
              <td className="numeric highlight">+{activity.credits}</td>
              <td className="kudos-col-cell">
                <EcoKudos targetId={String(activity.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
