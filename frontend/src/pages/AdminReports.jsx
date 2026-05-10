import Classification from './Classification';

// ML reports for admin reuse the classification view, since the underlying
// metrics/dataset are the same. Wrapping keeps the routing layer readable.
export default function AdminReports() {
  return <Classification />;
}
