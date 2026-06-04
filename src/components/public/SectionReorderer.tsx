'use client';

import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export interface Section {
  id: string;
  name: string;
  component: React.ReactNode;
  animationEnabled?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

interface SectionReordererProps {
  sections: Section[];
  onReorder?: (reorderedSections: Section[]) => void;
  isEditing?: boolean;
}

export const SectionReorderer: React.FC<SectionReordererProps> = ({
  sections: initialSections,
  onReorder,
  isEditing = false,
}) => {
  const [sections, setSections] = useState(initialSections);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const handleDragStart = (id: string) => {
    if (!isEditing) return;
    setDraggedId(id);
  };

  const handleDragOver = (id: string) => {
    if (!isEditing || !draggedId) return;
    setDragOverId(id);
  };

  const handleDrop = (id: string) => {
    if (!isEditing || !draggedId || draggedId === id) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedIdx = sections.findIndex(s => s.id === draggedId);
    const targetIdx = sections.findIndex(s => s.id === id);

    if (draggedIdx === -1 || targetIdx === -1) return;

    const newSections = [...sections];
    [newSections[draggedIdx], newSections[targetIdx]] = [
      newSections[targetIdx],
      newSections[draggedIdx],
    ];

    setSections(newSections);
    onReorder?.(newSections);

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="relative">
      {isEditing && (
        <div className="bg-primary/10 border-2 border-dashed border-primary rounded-lg p-4 mb-6">
          <p className="text-sm font-sans font-bold text-primary flex items-center gap-2">
            <GripVertical className="h-4 w-4" />
            Modo edición: arrastra las secciones para reordenarlas
          </p>
        </div>
      )}

      {sections.map((section, idx) => (
        <div
          key={section.id}
          draggable={isEditing}
          onDragStart={() => handleDragStart(section.id)}
          onDragOver={() => handleDragOver(section.id)}
          onDrop={() => handleDrop(section.id)}
          onDragEnd={handleDragEnd}
          className={`relative transition-all duration-200 ${
            isEditing ? 'cursor-move' : ''
          } ${
            draggedId === section.id ? 'opacity-50' : ''
          } ${
            dragOverId === section.id && draggedId !== section.id
              ? 'border-t-4 border-primary pt-4'
              : ''
          }`}
        >
          {isEditing && dragOverId === section.id && draggedId !== section.id && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-full" />
          )}

          {isEditing && (
            <div className="absolute -left-8 top-8 opacity-50 hover:opacity-100">
              <GripVertical className="h-5 w-5 text-primary" />
            </div>
          )}

          <div>{section.component}</div>
        </div>
      ))}
    </div>
  );
};
