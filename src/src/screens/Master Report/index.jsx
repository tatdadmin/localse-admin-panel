// import React, { useState, useEffect } from 'react';
// import { ChevronDown, Filter, Calendar, TrendingUp, Users, MousePointer, Star } from 'lucide-react';

// const MasterReport = () => {
//   const [filterType, setFilterType] = useState('day');
//   const [data, setData] = useState([
//     // Sample data for demonstration
//     {
//       date: '2024-08-06',
//       installation_count: 125,
//       registration_count: 98,
//       unique_clicks: 1250,
//       growth: 12.5,
//       customer_ratings: 4.2,
//       conversion_rate: 8.5,
//       acquisition_value: 15000,
//       permanent_sales: 45,
//       customer_referrals: 23,
//       driver_referrals: 18,
//       visit_count: 340
//     },
//     {
//       date: '2024-08-05',
//       installation_count: 110,
//       registration_count: 85,
//       unique_clicks: 1180,
//       growth: 8.2,
//       customer_ratings: 4.1,
//       conversion_rate: 7.8,
//       acquisition_value: 13500,
//       permanent_sales: 38,
//       customer_referrals: 19,
//       driver_referrals: 15,
//       visit_count: 295
//     }
//   ]);
//   const [loading, setLoading] = useState(false);

//   const filterOptions = [
//     { value: 'day', label: 'Daily', icon: Calendar },
//     { value: 'week', label: 'Weekly', icon: Calendar },
//     { value: 'month', label: 'Monthly', icon: Calendar },
//     { value: 'year', label: 'Yearly', icon: Calendar }
//   ];

//   const getData = async (type = filterType) => {
//     setLoading(true);
//     try {
//       const params = {};
      
//       switch (type) {
//         case 'day':
//           params.day_wise = "1";
//           break;
//         case 'week':
//           params.week_wise = "1";
//           break;
//         case 'month':
//           params.month_wise = "1";
//           break;
//         case 'year':
//           params.year_wise = "1";
//           break;
//         default:
//           params.day_wise = "1";
//       }

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       console.log('API Call Parameters:', params);
      
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, [filterType]);

//   const handleFilterChange = (newType) => {
//     setFilterType(newType);
//   };

//   const getAvailableColumns = () => {
//     if (data.length === 0) return [];
  
//     const sampleItem = data[0];
//     const availableKeys = Object.keys(sampleItem);
  
//     const columnMapping = {
//       date: { label: 'Date', icon: Calendar },
//       week: { label: 'Week', icon: Calendar },
//       month: { label: 'Month', icon: Calendar },
//       year: { label: 'Year', icon: Calendar },
//       installation_count: { label: 'Installations', icon: TrendingUp },
//       registration_count: { label: 'Registrations', icon: Users },
//       registrations: { label: 'Registrations', icon: Users },
//       unique_clicks: { label: 'Unique Clicks', icon: MousePointer },
//       growth: { label: 'Growth (%)', icon: TrendingUp },
//       customer_ratings: { label: 'Ratings', icon: Star },
//       ass_rate: { label: 'Ass Rate', icon: TrendingUp },
//       conversion_rate: { label: 'Conversion (%)', icon: TrendingUp },
//       acquisition_value: { label: 'Acquisition Value', icon: TrendingUp },
//       permanent_sales: { label: 'Permanent Sales', icon: TrendingUp },
//       customer_referrals: { label: 'Customer Referrals', icon: Users },
//       driver_referrals: { label: 'Driver Referrals', icon: Users },
//       visit_count: { label: 'Daily Visits', icon: Users }
//     };
  
//     const filteredKeys = availableKeys.filter(
//       key => columnMapping[key] && key !== 'start_date' && key !== 'end_date'
//     );
  
//     const prioritizedKeys = [];
  
//     const timeKeys = ['date', 'week', 'month', 'year'];
//     const timeKey = timeKeys.find(k => filteredKeys.includes(k));
//     if (timeKey) {
//       prioritizedKeys.push(timeKey);
//     }
  
//     if (filteredKeys.includes('installation_count')) {
//       prioritizedKeys.push('installation_count');
//     }
  
//     filteredKeys.forEach(key => {
//       if (!prioritizedKeys.includes(key)) {
//         prioritizedKeys.push(key);
//       }
//     });
  
//     return prioritizedKeys.map(key => ({
//       key,
//       label: columnMapping[key].label,
//       icon: columnMapping[key].icon
//     }));
//   };

//   const formatValue = (key, value) => {
//     if (!value && value !== 0) return '—';
    
//     switch (key) {
//       case 'growth':
//       case 'conversion_rate':
//         return `${value}%`;
//       case 'customer_ratings':
//         return `${value} ⭐`;
//       case 'acquisition_value':
//         return `$${value.toLocaleString()}`;
//       default:
//         return typeof value === 'number' ? value.toLocaleString() : value;
//     }
//   };

//   const getStatCards = () => {
//     if (data.length === 0) return [];
    
//     const totalInstallations = data.reduce((sum, item) => sum + (item.installation_count || 0), 0);
//     const totalRegistrations = data.reduce((sum, item) => sum + (item.registration_count || 0), 0);
//     const avgRating = data.reduce((sum, item) => sum + (item.customer_ratings || 0), 0) / data.length;
//     const totalClicks = data.reduce((sum, item) => sum + (item.unique_clicks || 0), 0);

//     return [
//       { label: 'Total Installations', value: totalInstallations, icon: TrendingUp, color: 'text-blue-600' },
//       { label: 'Total Registrations', value: totalRegistrations, icon: Users, color: 'text-green-600' },
//       { label: 'Avg Rating', value: avgRating.toFixed(1), icon: Star, color: 'text-yellow-600' },
//       { label: 'Total Clicks', value: totalClicks, icon: MousePointer, color: 'text-purple-600' }
//     ];
//   };

//   const renderTableHeaders = () => {
//     const availableColumns = getAvailableColumns();
//     return ['S.N.', ...availableColumns.map(col => col.label)];
//   };

//   const renderTableRow = (item, index) => {
//     const availableColumns = getAvailableColumns();
    
//     return (
//       <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/50 transition-colors duration-200`}>
//         <td className="py-4 px-6 text-center font-medium text-gray-600">{index + 1}</td>
//         {availableColumns.map((col) => {
//           let value = item[col.key];
          
//           return (
//             <td key={col.key} className="py-4 px-6 text-center text-gray-800 font-medium">
//               {formatValue(col.key, value)}
//             </td>
//           );
//         })}
//       </tr>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
//         <div className="px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-white">Master Report Dashboard</h1>
//               <p className="text-slate-300 mt-1">Comprehensive analytics and performance metrics</p>
//             </div>
//             <div className="flex items-center space-x-2 text-slate-300">
//               <Filter className="h-5 w-5" />
//               <span className="text-sm">Filter by {filterType}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="px-8 py-6 -mt-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           {getStatCards().map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.label}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
//                 </div>
//                 <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
//                   <stat.icon className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           {/* Filters Section */}
//           <div className="p-6 border-b border-gray-100 bg-gray-50/50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <h2 className="text-lg font-semibold text-gray-800">Report Data</h2>
//                 <div className="relative">
//                   <select
//                     value={filterType}
//                     onChange={(e) => handleFilterChange(e.target.value)}
//                     className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-300 transition-colors duration-200"
//                   >
//                     {filterOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Showing {data.length} {data.length === 1 ? 'record' : 'records'}
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
//                   {renderTableHeaders().map((header, index) => (
//                     <th key={index} className="py-4 px-6 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={renderTableHeaders().length} className="py-16 text-center">
//                       <div className="flex flex-col items-center justify-center space-y-4">
//                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
//                         <div className="text-gray-600">
//                           <p className="font-medium">Loading data...</p>
//                           <p className="text-sm text-gray-500">Please wait while we fetch your report</p>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : data.length === 0 ? (
//                   <tr>
//                     <td colSpan={renderTableHeaders().length} className="py-16 text-center">
//                       <div className="flex flex-col items-center justify-center space-y-4">
//                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                           <Filter className="h-8 w-8 text-gray-400" />
//                         </div>
//                         <div className="text-gray-600">
//                           <p className="font-medium">No data available</p>
//                           <p className="text-sm text-gray-500">Try adjusting your filter criteria</p>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item, index) => renderTableRow(item, index))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MasterReport;





import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, Calendar, TrendingUp, Users, MousePointer, Star } from 'lucide-react';
import { GET_MASTER_ADMIN_DATA } from '../../apis/Apis';

const MasterReport = () => {
  const [filterType, setFilterType] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Bootstrap CSS via CDN
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const filterOptions = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'year', label: 'Yearly' }
  ];

  const getData = async (type = filterType) => {
    setLoading(true);
    try {
      const params = {};
      
      switch (type) {
        case 'day':
          params.day_wise = "1";
          break;
        case 'week':
          params.week_wise = "1";
          break;
        case 'month':
          params.month_wise = "1";
          break;
        case 'year':
          params.year_wise = "1";
          break;
        default:
          params.day_wise = "1";
      }

      const res = await GET_MASTER_ADMIN_DATA(params);
      setData(res.data || []);
      
      console.log('API Call Parameters:', params);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [filterType]);

  const handleFilterChange = (newType) => {
    setFilterType(newType);
  };

  const getAvailableColumns = () => {
    if (data.length === 0) return [];
  
    const sampleItem = data[0];
    const availableKeys = Object.keys(sampleItem);
  
    const columnMapping = {
      date: 'Date',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      installation_count: 'Installations',
      registration_count: 'Registrations',
      registrations: 'Registrations',
      unique_clicks: 'Unique Clicks',
      growth: 'Growth (%)',
      customer_ratings: 'Ratings',
      ass_rate: 'Ass Rate',
      conversion_rate: 'Conversion (%)',
      acquisition_value: 'Acquisition Value',
      permanent_sales: 'Permanent Sales',
      customer_referrals: 'Customer Referrals',
      driver_referrals: 'Driver Referrals',
      visit_count: 'Daily Visits'
    };
  
    const filteredKeys = availableKeys.filter(
      key => columnMapping[key] && key !== 'start_date' && key !== 'end_date'
    );
  
    const prioritizedKeys = [];
  
    const timeKeys = ['date', 'week', 'month', 'year'];
    const timeKey = timeKeys.find(k => filteredKeys.includes(k));
    if (timeKey) {
      prioritizedKeys.push(timeKey);
    }
  
    if (filteredKeys.includes('installation_count')) {
      prioritizedKeys.push('installation_count');
    }
  
    filteredKeys.forEach(key => {
      if (!prioritizedKeys.includes(key)) {
        prioritizedKeys.push(key);
      }
    });
  
    return prioritizedKeys.map(key => ({
      key,
      label: columnMapping[key]
    }));
  };

  const formatValue = (key, value) => {
    if (!value && value !== 0) return '—';
    
    switch (key) {
      case 'growth':
      case 'conversion_rate':
        return `${value}%`;
      case 'customer_ratings':
        return `${value} ⭐`;
      case 'acquisition_value':
        return `$${value.toLocaleString()}`;
      default:
        return typeof value === 'number' ? value.toLocaleString() : value;
    }
  };

  const getStatCards = () => {
    if (data.length === 0) return [];
    
    const totalInstallations = data.reduce((sum, item) => sum + (item.installation_count || 0), 0);
    const totalRegistrations = data.reduce((sum, item) => sum + (item.registration_count || 0), 0);
    const avgRating = data.reduce((sum, item) => sum + (item.customer_ratings || 0), 0) / data.length;
    const totalClicks = data.reduce((sum, item) => sum + (item.unique_clicks || 0), 0);

    return [
      { 
        label: 'Total Installations', 
        value: totalInstallations, 
        icon: TrendingUp, 
        bgColor: 'bg-primary',
        textColor: 'text-primary' 
      },
      { 
        label: 'Total Registrations', 
        value: totalRegistrations, 
        icon: Users, 
        bgColor: 'bg-success',
        textColor: 'text-success' 
      },
      { 
        label: 'Avg Rating', 
        value: avgRating.toFixed(1), 
        icon: Star, 
        bgColor: 'bg-warning',
        textColor: 'text-warning' 
      },
      { 
        label: 'Total Clicks', 
        value: totalClicks, 
        icon: MousePointer, 
        bgColor: 'bg-info',
        textColor: 'text-info' 
      }
    ];
  };

  const renderTableHeaders = () => {
    const availableColumns = getAvailableColumns();
    return ['S.N.', ...availableColumns.map(col => col.label)];
  };

  const renderTableRow = (item, index) => {
    const availableColumns = getAvailableColumns();
    
    return (
      <tr key={index} className={index % 2 === 0 ? 'table-light' : ''}>
        <td className="text-center fw-medium">{index + 1}</td>
        {availableColumns.map((col) => {
          let value = item[col.key];
          
          return (
            <td key={col.key} className="text-center">
              {formatValue(col.key, value)}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
      {/* Header */}
      <div className="text-white shadow-lg" style={{background: 'linear-gradient(135deg, #343a40 0%, #495057 100%)'}}>
        <div className="container-fluid px-4 py-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="h2 fw-bold mb-1">Master Report Dashboard</h1>
              {/* <p className="mb-0 opacity-75">Comprehensive analytics and performance metrics</p> */}
            </div>
            {/* <div className="col-md-4 text-md-end">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <Filter size={20} />
                <small>Filter by {filterType}</small>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Stats Cards */}
        {/* {data.length > 0 && (
          <div className="row mb-4">
            {getStatCards().map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm h-100" style={{transition: 'all 0.3s ease'}}>
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col">
                        <p className="text-muted small mb-1 fw-medium">{stat.label}</p>
                        <h3 className="fw-bold mb-0">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</h3>
                      </div>
                      <div className="col-auto">
                        <div className={`rounded-3 p-3 ${stat.bgColor} bg-opacity-10`}>
                          <stat.icon className={stat.textColor} size={28} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Main Content */}
        <div className="card border-0 shadow-sm">
          {/* Filters Section */}
          <div className="card-header bg-light border-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="mb-0 fw-semibold">Report Data</h5>
                  <div className="position-relative">
                    <select
                      value={filterType}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="form-select form-select-sm border-secondary"
                      style={{paddingRight: '2.5rem', minWidth: '120px'}}
                    >
                      {filterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="position-absolute text-muted" 
                      size={16}
                      style={{right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} 
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 text-md-end">
                <small className="text-muted">
                  Showing {data.length} {data.length === 1 ? 'record' : 'records'}
                </small>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-secondary">
                  <tr>
                    {renderTableHeaders().map((header, index) => (
                      <th key={index} className="text-center fw-semibold border-end">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={renderTableHeaders().length} className="py-5 text-center">
                        <div className="d-flex flex-column align-items-center gap-3">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <div>
                            <p className="fw-medium mb-1">Loading data...</p>
                            <small className="text-muted">Please wait while we fetch your report</small>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={renderTableHeaders().length} className="py-5 text-center">
                        <div className="d-flex flex-column align-items-center gap-3">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px'}}>
                            <Filter className="text-muted" size={32} />
                          </div>
                          <div>
                            <p className="fw-medium mb-1">No data available</p>
                            <small className="text-muted">Try adjusting your filter criteria</small>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => renderTableRow(item, index))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterReport;