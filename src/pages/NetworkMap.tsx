import React, { useState, useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useAppStore, selectors } from '../store';
import { Contact, Connection, Domain, Circle, LifecycleStage } from '../types';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, UserCircleIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow, parseISO } from 'date-fns';

const DOMAIN_COLORS: Record<Domain, string> = {
  personal: '#E8A3A3',
  professional: '#A3BAE8',
  community: '#A3E8B5',
  hybrid: '#E8C5A3'
};

const CIRCLE_COLORS: Record<Circle | 'dormant', string> = {
  core: '#D4A853',
  orbit: '#5C8A3C',
  peripheral: '#7B8FA1',
  dormant: '#C4B9AC'
};

export default function NetworkMap() {
  const contactsMap = useAppStore(state => state.contacts);
  const contactsCount = Object.keys(contactsMap).length;
  const connectionsMap = useAppStore(state => state.connections);
  const interactions = useAppStore(state => state.interactions);
  const navigate = useNavigate();

  const [colorBy, setColorBy] = useState<'circle' | 'domain'>('circle');
  const [visibleCircles, setVisibleCircles] = useState<Record<string, boolean>>({
    core: true,
    orbit: true,
    peripheral: true
  });
  const [hideDormant, setHideDormant] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const newWidth = entries[0].contentRect.width;
        const newHeight = entries[0].contentRect.height;
        setDimensions(prev => {
          if (prev.width === newWidth && prev.height === newHeight) return prev;
          return { width: newWidth, height: newHeight };
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const graphData = useMemo(() => {
    const contactsArray = Object.values(contactsMap);
    const connectionsArray = Object.values(connectionsMap);
    const nodes = contactsArray
      .filter(c => hideDormant ? c.lifecycle_stage !== 'dormant' && c.lifecycle_stage !== 'drift' : true)
      .filter(c => c.lifecycle_stage === 'dormant' ? true : visibleCircles[c.circle])
      .map(c => {
        // Last contact
        const contactInteractions = Object.values(interactions).filter(i => i.contact_id === c.id);
        contactInteractions.sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
        const lastContact = contactInteractions[0]?.occurred_at;

        // Determine node color
        let color = CIRCLE_COLORS.dormant;
        if (colorBy === 'circle') {
          if (c.lifecycle_stage === 'dormant') {
             color = CIRCLE_COLORS.dormant;
          } else {
             color = CIRCLE_COLORS[c.circle as Circle] || CIRCLE_COLORS.orbit;
          }
        } else if (colorBy === 'domain') {
          color = DOMAIN_COLORS[c.domain as Domain] || '#999';
        }

        let radius = 6;
        if (lastContact) {
            const daysAgo = (new Date().getTime() - parseISO(lastContact).getTime()) / (1000 * 3600 * 24);
            if (daysAgo <= 30) radius = 8;
            else if (daysAgo > 90) radius = 4;
        } else {
            radius = 4;
        }

        return {
          id: c.id,
          name: `${c.first_name} ${c.last_name || ''}`.trim(),
          color,
          val: radius,
          c,
          lastContact
        };
      });

    const nodeIds = new Set(nodes.map(n => n.id));

    const links = connectionsArray
      .filter(conn => nodeIds.has(conn.contact_a_id) && nodeIds.has(conn.contact_b_id))
      .map(conn => ({
        source: conn.contact_a_id,
        target: conn.contact_b_id,
        strength: conn.strength
      }));

    return { nodes, links };
  }, [contactsMap, connectionsMap, interactions, colorBy, visibleCircles, hideDormant]);

  const toggleCircle = (circle: string) => {
    setVisibleCircles(prev => ({ ...prev, [circle]: !prev[circle] }));
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] animate-in fade-in">
      <div className="bg-white/80 backdrop-blur-md border-b border-border-subtle p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar sm:pb-0 w-full">
           <div className="flex bg-[var(--surface-bg)] p-1 rounded-lg border border-border-medium shrink-0">
             <button
               onClick={() => setColorBy('circle')}
               className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${colorBy === 'circle' ? 'bg-white shadow-sm text-black' : 'text-on-surface/50 hover:text-on-surface'}`}
             >
               Colour by Circle
             </button>
             <button
               onClick={() => setColorBy('domain')}
               className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${colorBy === 'domain' ? 'bg-white shadow-sm text-black' : 'text-on-surface/50 hover:text-on-surface'}`}
             >
               Colour by Domain
             </button>
           </div>

           <div className="flex items-center gap-3 border-l border-border-subtle pl-4 shrink-0">
             {['core', 'orbit', 'peripheral'].map(circle => (
               <label key={circle} className="flex items-center gap-2 text-sm font-medium capitalize cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={visibleCircles[circle]}
                   onChange={() => toggleCircle(circle)}
                   className="rounded text-botanical focus:ring-botanical border-border-medium"
                 />
                 {circle}
               </label>
             ))}
           </div>

           <div className="flex items-center gap-2 border-l border-border-subtle pl-4 shrink-0">
               <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={hideDormant}
                   onChange={() => setHideDormant(!hideDormant)}
                   className="rounded text-botanical focus:ring-botanical border-border-medium"
                 />
                 Hide dormant
               </label>
           </div>
        </div>
      </div>

      <div className="flex-1 relative" ref={containerRef} style={{ backgroundColor: '#FAF7F2' }}>
        {contactsCount < 3 ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="font-serif italic text-on-surface/50">Add at least 3 contacts to see your network map take shape.</p>
            </div>
        ) : (
            <ForceGraph2D
                graphData={graphData}
                width={dimensions.width}
                height={dimensions.height}
                nodeAutoColorBy={undefined}
                nodeColor={node => (node as any).color}
                nodeRelSize={1}
                linkColor={() => 'rgba(0,0,0,0.2)'}
                linkWidth={(link: any) => link.strength === 'strong' ? 2.5 : link.strength === 'weak' ? 1 : 0.5}
                nodeLabel="name"
                onNodeClick={handleNodeClick}
                backgroundColor="#FAF7F2"
            />
        )}
      </div>

      {selectedNode && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-border-subtle shadow-2xl p-6 flex flex-col z-50 animate-in slide-in-from-right">
              <button 
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-hover transition-colors"
                  aria-label="Close"
              >
                  <XMarkIcon className="w-5 h-5 text-on-surface/50" />
              </button>

              <div className="mt-8 space-y-6 flex-1">
                  <div>
                      <h2 className="font-serif text-2xl font-bold mb-2">{selectedNode.name}</h2>
                      <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-md bg-botanical/10 text-botanical capitalize">
                          {selectedNode.c.circle} Circle
                      </span>
                  </div>

                  {selectedNode.c.domain && (
                      <div>
                          <h3 className="text-xs uppercase tracking-widest text-on-surface/50 font-bold mb-1">Domain</h3>
                          <p className="text-sm capitalize font-medium">{selectedNode.c.domain}</p>
                      </div>
                  )}

                  <div>
                      <h3 className="text-xs uppercase tracking-widest text-on-surface/50 font-bold mb-1">Last Contact</h3>
                      <p className="text-sm font-medium">
                          {selectedNode.lastContact 
                              ? `Last contact: ${formatDistanceToNow(parseISO(selectedNode.lastContact))} ago`
                              : 'No contact logged yet'}
                      </p>
                  </div>
              </div>

              <div className="space-y-3 shrink-0">
                  <button 
                      onClick={() => navigate(`/contact/${selectedNode.id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-botanical text-white px-4 py-3 rounded-xl font-bold hover:bg-botanical/90 transition-colors"
                  >
                      <UserCircleIcon className="w-5 h-5" /> View profile
                  </button>
                  <button 
                      className="w-full flex items-center justify-center gap-2 bg-white text-on-surface border border-border-medium px-4 py-3 rounded-xl font-bold hover:bg-surface-hover transition-colors"
                  >
                      <ChatBubbleLeftIcon className="w-5 h-5" /> Log interaction
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
