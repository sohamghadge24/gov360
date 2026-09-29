"use client";

import React, { useEffect, useState } from "react";
import { getOrganizationTree, OrganizationNode } from "@/api/organization";
import { ChevronRight, ChevronDown, Building2, Layers, Briefcase, MapPin } from "lucide-react";
import clsx from "clsx";

interface TreeNodeProps {
  node: OrganizationNode;
  level: number;
  onSelect: (node: OrganizationNode) => void;
  selectedNode: OrganizationNode | null;
}

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'organization': return <Building2 className="w-4 h-4 text-blue-600" />;
    case 'department': return <Briefcase className="w-4 h-4 text-indigo-600" />;
    case 'division': return <Layers className="w-4 h-4 text-purple-600" />;
    case 'ward':
    case 'zone':
    case 'site': return <MapPin className="w-4 h-4 text-emerald-600" />;
    default: return <div className="w-4 h-4 border border-gray-300 rounded-sm" />;
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onSelect, selectedNode }) => {
  const [expanded, setExpanded] = useState(level < 1); // Auto-expand first level
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode?.id === node.id;

  return (
    <div className="select-none">
      <div
        className={clsx(
          "flex items-center py-1.5 px-2 rounded-md cursor-pointer text-sm transition-colors",
          isSelected ? "bg-blue-50 text-blue-900" : "hover:bg-gray-100 text-gray-700"
        )}
        style={{ paddingLeft: `${level * 1.2 + 0.5}rem` }}
        onClick={() => onSelect(node)}
      >
        <span 
          className="w-5 h-5 flex items-center justify-center mr-1"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              setExpanded(!expanded);
            }
          }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <span className="w-3.5 h-3.5 inline-block" />
          )}
        </span>
        <span className="mr-2 flex-shrink-0">
          {getIcon(node.type)}
        </span>
        <span className="truncate flex-1 font-medium">{node.name}</span>
        {node.status === 'Inactive' && (
          <span className="ml-2 w-2 h-2 rounded-full bg-gray-300" title="Inactive"></span>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedNode={selectedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrganizationTree = ({
  onSelect,
  selectedNode
}: {
  onSelect: (node: OrganizationNode) => void;
  selectedNode: OrganizationNode | null;
}) => {
  const [tree, setTree] = useState<OrganizationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOrganizationTree()
      .then(data => {
        if (!mounted) return;
        setTree(data);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 ml-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 ml-8"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 ml-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-600 mb-2">Unable to load organization structure.</p>
        <button onClick={() => window.location.reload()} className="text-sm font-medium text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">No organizations found.</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {tree.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onSelect={onSelect}
          selectedNode={selectedNode}
        />
      ))}
    </div>
  );
};
