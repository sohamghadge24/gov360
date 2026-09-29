import React from "react";
import { OrganizationNode } from "@/api/organization";
import { Building2, Briefcase, Layers, MapPin, MoreHorizontal } from "lucide-react";
import clsx from "clsx";

interface EntityDetailsProps {
  node: OrganizationNode;
}

export const EntityDetails: React.FC<EntityDetailsProps> = ({ node }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Selected Entity</h2>
          <div className="flex items-center gap-2">
            {node.type.toLowerCase() === 'department' ? <Briefcase className="w-5 h-5 text-indigo-600" /> :
             node.type.toLowerCase() === 'division' ? <Layers className="w-5 h-5 text-purple-600" /> :
             node.type.toLowerCase() === 'organization' ? <Building2 className="w-5 h-5 text-blue-600" /> :
             <MapPin className="w-5 h-5 text-emerald-600" />
            }
            <h3 className="text-xl font-bold text-gray-900">{node.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx(
            "px-2.5 py-1 text-xs font-medium rounded-full",
            node.status === 'Active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          )}>
            {node.status}
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
        <div>
          <span className="text-gray-500 block mb-1">Code</span>
          <span className="font-medium text-gray-900">{node.code}</span>
        </div>
        <div>
          <span className="text-gray-500 block mb-1">Type</span>
          <span className="font-medium text-gray-900 capitalize">{node.type}</span>
        </div>
        {node.children && (
          <div>
            <span className="text-gray-500 block mb-1">Sub-entities</span>
            <span className="font-medium text-gray-900">{node.children.length}</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-3">
        {node.status === 'Active' && (
          <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent rounded-md transition-colors">
            Deactivate
          </button>
        )}
        <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-transparent rounded-md transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
};
