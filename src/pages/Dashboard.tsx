import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { People, LocationOn, EventBusy, AdminPanelSettings } from '@mui/icons-material';

const generateLastNDays = (n: number) => {
  const today = new Date();
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    dates.push({
      day: `${month} ${day}`,
      visits: Math.floor(Math.random() * 20) + 5,
      leaves: Math.floor(Math.random() * 10), 
    });
  }
  return dates;
};

const dummyData = {
  customers: 150,
  sites: 45,
  leaves: 23,
  admins: 5,
  siteVisits: generateLastNDays(7).map((item) => ({
    day: item.day,
    visits: item.visits,
  })),
  leaveData: generateLastNDays(30).map((item) => ({
    day: item.day,
    leaves: item.leaves,
  })),
};

const StatCard: React.FC<{ title: string; value: number; change: string; subText: string; icon: React.ReactNode }> = ({ title, value, change, subText, icon }) => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
        <Box sx={{ color: 'text.secondary', fontSize: 20 }}>{icon}</Box>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>{value}</Typography>
      <Typography variant="body2" color={change.startsWith('+') ? 'success.main' : 'error.main'}>{change}</Typography>
      <Typography variant="body2" color="text.secondary">{subText}</Typography>
    </CardContent>
  </Card>
);

const ChartCard: React.FC<{ title: string; subText: string; data: any[] }> = ({ title, subText, data }) => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', p: 2 }}>
    <Typography 
      variant="subtitle1" 
      sx={{ fontWeight: 700,  }}
    >
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{subText}</Typography>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="day" stroke="#666" interval={title.includes('Leaves') ? 4 : 0} />
        <YAxis stroke="#666" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={title.includes('Walk-Ins') ? 'visits' : 'leaves'}
          stroke={title.includes('Walk-Ins') ? '#1976d2' : '#2e7d32'}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <Layout title={`Welcome Back, ${currentUser.firstName || 'User'}`}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="text.secondary">Customers</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Walk-Ins"
            value={dummyData.customers}
            change="+6 from the previous 7 days"
            subText="On average, 46 customers visit your business per day."
            icon={<People />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sites"
            value={dummyData.sites}
            change="+3 from the previous 7 days"
            subText="On average, 29 sites are active per day."
            icon={<LocationOn />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Leaves"
            value={dummyData.leaves}
            change="+2 from the previous 7 days"
            subText="On average, 3 leaves per day."
            icon={<EventBusy />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Admins"
            value={dummyData.admins}
            change="+2 from the previous 7 days"
            subText="On average, 1 admin active per day."
            icon={<AdminPanelSettings />}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard
            title="Walk-Ins"
            subText="On average, 46 customers visit your business per day."
            data={dummyData.siteVisits}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Leaves Taken"
            subText="On average, 3 leaves taken per day."
            data={dummyData.leaveData}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;