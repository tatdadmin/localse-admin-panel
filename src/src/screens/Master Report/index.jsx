import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { GET_MASTER_ADMIN_DATA } from '../../apis/Apis';

const MasterReport = () => {
  const [filterType, setFilterType] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ];

  const getData = async (type = filterType) => {
    setLoading(true);
    try {
      const params = {};
      
      // Set the appropriate parameter based on filter type
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
      installation_count: 'Installation Count',
      registration_count: 'Registrations',
      registrations: 'Registrations',
      unique_clicks: 'Unique Clicks',
      growth: 'Growth',
      customer_ratings: 'Customer Ratings',
      ass_rate: 'Ass Rate',
      conversion_rate: 'Conversion Rate',
      acquisition_value: 'Acquisition Value',
      permanent_sales: 'Permanent Sales',
      customer_referrals: 'Customer Referrals',
      driver_referrals: 'Driver Referrals'
    };
  
    // Filter out valid keys and remove unwanted ones
    const filteredKeys = availableKeys.filter(
      key => columnMapping[key] && key !== 'start_date' && key !== 'end_date'
    );
  
    const prioritizedKeys = [];
  
    // Add the first available time-based column
    const timeKeys = ['date', 'week', 'month', 'year'];
    const timeKey = timeKeys.find(k => filteredKeys.includes(k));
    if (timeKey) {
      prioritizedKeys.push(timeKey);
    }
  
    // Add 'installation_count' next
    if (filteredKeys.includes('installation_count')) {
      prioritizedKeys.push('installation_count');
    }
  
    // Add remaining keys excluding the already added ones
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
  
  

  const renderTableHeaders = () => {
    const availableColumns = getAvailableColumns();
    return ['S.N.', ...availableColumns.map(col => col.label)];
  };

  const renderTableRow = (item, index) => {
    const availableColumns = getAvailableColumns();
    
    return (
      <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
        <td className="py-4 px-4 text-center font-medium">{index + 1}.</td>
        {availableColumns.map((col) => {
          let value = item[col.key];
          
          return (
            <td key={col.key} className="py-4 px-4 text-center">
              {value || 0}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header */}
      <div className="bg-blue-900 text-white px-8 py-1" style={{backgroundColor:"red"}}>
        <h4 className="font-semibold">Master Report</h4>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Filters Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-6">
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" /> */}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  {renderTableHeaders().map((header, index) => (
                    <th key={index} className="py-4 px-4 text-center text-sm font-semibold text-gray-800 border-r border-gray-300 last:border-r-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={renderTableHeaders().length} className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={renderTableHeaders().length} className="py-12 text-center text-gray-500">
                      No data available
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
  );
};

export default MasterReport;