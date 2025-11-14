import React from 'react';

interface JsonViewerProps {
  data: object;
}

const JsonValue: React.FC<{ value: any, indent: number }> = ({ value, indent }) => {
  const type = typeof value;

  if (value === null) {
    return <span className="text-purple-400">null</span>;
  }
  if (type === 'string') {
    return <span className="text-green-400">"{value}"</span>;
  }
  if (type === 'number') {
    return <span className="text-blue-400">{value}</span>;
  }
  if (type === 'boolean') {
    return <span className="text-purple-400">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    return <JsonArray array={value} indent={indent} />;
  }
  if (type === 'object') {
    return <JsonObject object={value} indent={indent} />;
  }
  return null;
};

const JsonObject: React.FC<{ object: object, indent: number }> = ({ object, indent }) => {
  const entries = Object.entries(object);
  
  if (entries.length === 0) {
    return <><span className="text-gray-400">{'{'}</span><span className="text-gray-400">{'}'}</span></>;
  }

  return (
    <>
      <span className="text-gray-400">{'{'}</span>
      {entries.map(([key, value], index) => (
        <div key={key} style={{ paddingLeft: `${(indent + 1) * 1.5}rem` }}>
          <span className="text-cyan-400">"{key}"</span>
          <span className="text-gray-400">: </span>
          <JsonValue value={value} indent={indent + 1} />
          {index < entries.length - 1 && <span className="text-gray-400">,</span>}
        </div>
      ))}
      <div style={{ paddingLeft: `${indent * 1.5}rem` }}><span className="text-gray-400">{'}'}</span></div>
    </>
  );
};

const JsonArray: React.FC<{ array: any[], indent: number }> = ({ array, indent }) => {
    if (array.length === 0) {
        return <><span className="text-gray-400">{'['}</span><span className="text-gray-400">{']'}</span></>;
    }
  
    return (
    <>
      <span className="text-gray-400">{'['}</span>
      {array.map((value, index) => (
        <div key={index} style={{ paddingLeft: `${(indent + 1) * 1.5}rem` }}>
          <JsonValue value={value} indent={indent + 1} />
          {index < array.length - 1 && <span className="text-gray-400">,</span>}
        </div>
      ))}
      <div style={{ paddingLeft: `${indent * 1.5}rem` }}><span className="text-gray-400">{']'}</span></div>
    </>
  );
};

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <pre className="text-sm bg-transparent font-mono">
      <JsonObject object={data} indent={0} />
    </pre>
  );
};
