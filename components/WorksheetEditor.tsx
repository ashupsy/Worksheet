
import React from 'react';
import { Worksheet, WorksheetSection, WorksheetField } from '../types';

interface WorksheetEditorProps {
  worksheet: Worksheet;
  onUpdate: (updated: Worksheet) => void;
}

const WorksheetEditor: React.FC<WorksheetEditorProps> = ({ worksheet, onUpdate }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...worksheet, title: e.target.value });
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...worksheet, introduction: e.target.value });
  };

  const handleFieldValueChange = (sectionId: string, fieldId: string, value: any) => {
    const newSections = worksheet.sections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        fields: section.fields.map(field => {
          if (field.id !== fieldId) return field;
          return { ...field, value };
        })
      };
    });
    onUpdate({ ...worksheet, sections: newSections });
  };

  return (
    <div className="worksheet-container bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200 print:shadow-none print:border-none max-w-4xl mx-auto mb-10">
      {/* Header */}
      <div className="bg-slate-800 text-white p-8 print:bg-white print:text-slate-900 print:p-4">
        <input
          type="text"
          value={worksheet.title}
          onChange={handleTitleChange}
          className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-500 focus:border-white focus:outline-none w-full mb-2 print:border-none"
        />
        <div className="flex items-center gap-4 text-slate-300 print:text-slate-600 text-sm">
          <span><strong>Modality:</strong> {worksheet.modality}</span>
          <span><strong>Focus:</strong> {worksheet.focus}</span>
          <span className="ml-auto print:hidden">ID: {worksheet.id.slice(0, 8)}</span>
        </div>
      </div>

      {/* Intro */}
      <div className="p-8 space-y-8">
        <section>
          <textarea
            value={worksheet.introduction}
            onChange={handleIntroChange}
            rows={3}
            className="w-full text-slate-600 italic border-none focus:ring-0 resize-none print:mb-4"
            placeholder="Introduction text..."
          />
          <hr className="mt-4 border-slate-100" />
        </section>

        {/* Dynamic Sections */}
        {worksheet.sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 border-l-4 border-indigo-500 pl-3">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-sm text-slate-500 mb-4">{section.description}</p>
            )}
            
            <div className="grid gap-6">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value as string || ''}
                      onChange={(e) => handleFieldValueChange(section.id, field.id, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      rows={4}
                      placeholder={field.placeholder}
                      value={field.value as string || ''}
                      onChange={(e) => handleFieldValueChange(section.id, field.id, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  )}

                  {field.type === 'scale' && (
                    <div className="flex items-center gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleFieldValueChange(section.id, field.id, num)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                            field.value === num 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === 'checkbox' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => handleFieldValueChange(section.id, field.id, e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">{field.placeholder || "Select if applicable"}</span>
                    </div>
                  )}

                  {field.type === 'checklist' && field.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {field.options.map((option) => {
                        const currentValues = Array.isArray(field.value) ? field.value : [];
                        const isChecked = currentValues.includes(option);
                        return (
                          <div key={option} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newValues = e.target.checked 
                                  ? [...currentValues, option]
                                  : currentValues.filter(v => v !== option);
                                handleFieldValueChange(section.id, field.id, newValues);
                              }}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-600">{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        
        {worksheet.footer && (
          <div className="mt-12 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center italic">
            {worksheet.footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksheetEditor;
