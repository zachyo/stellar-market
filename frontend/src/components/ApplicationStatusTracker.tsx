'use client';

import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationStatusTrackerProps {
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  lastUpdated?: string;
  showTimeline?: boolean;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Pending Review'
  },
  accepted: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Accepted'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Rejected'
  },
  withdrawn: {
    icon: AlertCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Withdrawn'
  }
};

export default function ApplicationStatusTracker({
  status,
  submittedAt,
  lastUpdated,
  showTimeline = true
}: ApplicationStatusTrackerProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-5 h-5 ${config.color}`} />
        <div>
          <h3 className="font-semibold text-gray-900">{config.label}</h3>
          <p className="text-sm text-gray-600">
            Submitted {new Date(submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {showTimeline && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Application submitted</span>
            <span className="text-gray-400 ml-auto">
              {new Date(submittedAt).toLocaleString()}
            </span>
          </div>
          
          {status !== 'pending' && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                status === 'accepted' ? 'bg-green-500' : 
                status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-gray-600">Status updated to {config.label.toLowerCase()}</span>
              <span className="text-gray-400 ml-auto">
                {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Recently'}
              </span>
            </div>
          )}
        </div>
      )}

      {status === 'pending' && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
          💡 Your application is being reviewed. You'll be notified of any updates.
        </div>
      )}
    </div>
  );
}