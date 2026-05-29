"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Car, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Settings2, 
  MoreVertical,
  Plus,
  Search,
  MapPin,
  CalendarDays
} from 'lucide-react'

// Mock Data for Fleet
const MOCK_FLEET = [
  {
    id: 'V-001',
    model: 'Honda City',
    plate: 'KA 01 AB 1234',
    type: 'Manual',
    status: 'Active',
    nextService: '2026-06-15',
    mileage: '45,200 km',
    assignedTo: 'Rahul Sharma',
    condition: 'Good'
  },
  {
    id: 'V-002',
    model: 'Maruti Swift',
    plate: 'KA 05 CD 5678',
    type: 'Manual',
    status: 'Maintenance',
    nextService: '2026-05-25',
    mileage: '62,100 km',
    assignedTo: 'Unassigned',
    condition: 'Needs Service'
  },
  {
    id: 'V-003',
    model: 'Hyundai i20',
    plate: 'KA 03 EF 9012',
    type: 'Automatic',
    status: 'Active',
    nextService: '2026-07-10',
    mileage: '12,400 km',
    assignedTo: 'Priya Patel',
    condition: 'Excellent'
  },
  {
    id: 'V-004',
    model: 'Tata Nexon',
    plate: 'KA 51 GH 3456',
    type: 'Automatic',
    status: 'Active',
    nextService: '2026-08-05',
    mileage: '28,900 km',
    assignedTo: 'Amit Kumar',
    condition: 'Good'
  },
  {
    id: 'V-005',
    model: 'Toyota Glanza',
    plate: 'KA 04 IJ 7890',
    type: 'Manual',
    status: 'Active',
    nextService: '2026-06-30',
    mileage: '34,500 km',
    assignedTo: 'Vikram Singh',
    condition: 'Good'
  }
]

export default function FleetManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  const filteredFleet = MOCK_FLEET.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'All' || vehicle.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'text-[#34c759] bg-[#34c759]/10 border-[#34c759]/20'
    if (status === 'Maintenance') return 'text-[#ff9f0a] bg-[#ff9f0a]/10 border-[#ff9f0a]/20'
    return 'text-text-3 bg-white/5 border-white/10'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'Active') return <CheckCircle2 className="w-3.5 h-3.5" />
    if (status === 'Maintenance') return <AlertTriangle className="w-3.5 h-3.5" />
    return <Settings2 className="w-3.5 h-3.5" />
  }

  return (
    <div className="min-h-screen bg-void text-text-1 font-body p-6 lg:p-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 text-primary mb-2">
              <Car className="w-6 h-6" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">Admin Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-1 font-display tracking-tight uppercase">
              Fleet Management
            </h1>
            <p className="text-text-3 mt-2 text-sm max-w-xl">
              Track vehicle health, manage maintenance schedules, and monitor active assignments across your entire driving school fleet.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]">
            <Plus className="w-5 h-5" />
            Register Vehicle
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Fleet', value: '12', icon: Car, color: 'text-primary' },
            { label: 'Active Vehicles', value: '10', icon: CheckCircle2, color: 'text-[#34c759]' },
            { label: 'In Maintenance', value: '2', icon: Wrench, color: 'text-[#ff9f0a]' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface/50 border border-border p-6 rounded-2xl flex items-center justify-between backdrop-blur-md"
            >
              <div>
                <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider block mb-1">{stat.label}</span>
                <span className="text-4xl font-display font-bold text-text-1">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
            <input 
              type="text" 
              placeholder="Search by model or plate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['All', 'Manual', 'Automatic'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filterType === type 
                    ? 'bg-white text-void shadow-lg shadow-white/10' 
                    : 'bg-surface border border-border text-text-2 hover:text-text-1'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-surface/30 border border-border rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/80 border-b border-border text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  <th className="p-5 font-medium">Vehicle Details</th>
                  <th className="p-5 font-medium">Status</th>
                  <th className="p-5 font-medium">Transmission</th>
                  <th className="p-5 font-medium">Assigned To</th>
                  <th className="p-5 font-medium">Next Service</th>
                  <th className="p-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFleet.map((vehicle, idx) => (
                  <motion.tr 
                    key={vehicle.id}
                    initial={{ opacity: 0, opacity: 1 }} // Simplified for performance
                    className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-void border border-border flex items-center justify-center text-text-2 group-hover:text-primary transition-colors">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-text-1">{vehicle.model}</div>
                          <div className="text-[11px] font-mono text-text-3 mt-0.5 flex items-center gap-2">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{vehicle.plate}</span>
                            <span>{vehicle.mileage}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(vehicle.status)}`}>
                        {getStatusIcon(vehicle.status)}
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm text-text-2 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-text-3" />
                        {vehicle.type}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm text-text-2">
                        {vehicle.assignedTo !== 'Unassigned' ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-void font-bold">
                              {vehicle.assignedTo.charAt(0)}
                            </div>
                            {vehicle.assignedTo}
                          </>
                        ) : (
                          <span className="text-text-3 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-text-2 flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4 text-text-3" />
                          {vehicle.nextService}
                        </span>
                        {vehicle.status === 'Maintenance' && (
                          <span className="text-[10px] text-[#ff9f0a] mt-0.5">Currently at workshop</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-text-3 hover:text-text-1 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredFleet.length === 0 && (
              <div className="p-12 text-center text-text-3">
                <Car className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No vehicles found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
