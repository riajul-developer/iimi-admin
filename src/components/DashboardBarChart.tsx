import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const DashboardBarChart = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%">
      <BarChart data={data} margin={{ top: 15, right: 20, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} />
        <Tooltip contentStyle={{ fontSize: 12, color: '#666' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} >
            {data.map((entry : any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashboardBarChart;
