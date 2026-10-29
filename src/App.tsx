/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SovereignHero } from './components/SovereignHero';
import { MinistryMatrix } from './components/MinistryMatrix';
import { ProposalList } from './components/ProposalList';
import { ProposalStudio } from './components/ProposalStudio';
import { ProposalDetail } from './components/ProposalDetail';
import { MasterBlueprintViewer } from './components/MasterBlueprintViewer';
import { AnonymousAlertHub } from './components/AnonymousAlertHub';
import { AssemblySynthesisPortal } from './components/AssemblySynthesisPortal';
import { IdentityModal } from './components/IdentityModal';
import { sovereignStore, UserSession } from './lib/store';
import { Locale, I18N } from './lib/i18n';
import { CommentStanceType } from './lib/types';
import { Info, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [selectedMinistrySlug, setSelectedMinistrySlug] = useState<string | null>(null);
  const [activeBlueprintSha, setActiveBlueprintSha] = useState<string | undefined>(undefined);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState<boolean>(false);

  // Store reactive state
  const [storeState, setStoreState] = useState(() => ({
    proposals: sovereignStore.getProposals(),
    ministries: sovereignStore.getMinistries(),
    session: sovereignStore.getSession(),
    notifications: sovereignStore.getNotifications(),
    commits: sovereignStore.getCommits()
  }));

  useEffect(() => {
    const unsubscribe = sovereignStore.subscribe(() => {
      setStoreState({
        proposals: sovereignStore.getProposals(),
        ministries: sovereignStore.getMinistries(),
        session: sovereignStore.getSession(),
        notifications: sovereignStore.getNotifications(),
        commits: sovereignStore.getCommits()
      });
    });
    return unsubscribe;
  }, []);

  // Handle URL query or hash navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const langParam = urlParams.get('lang');
    const propParam = urlParams.get('prop');

    if (langParam === 'bn' || langParam === 'en') {
      setCurrentLocale(langParam);
    }
    if (viewParam) {
      setActiveView(viewParam);
    }
    if (propParam) {
      setSelectedProposalId(propParam);
      setActiveView('proposal-detail');
    }
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setActiveView(view);
    if (view === 'proposal-detail' && param) {
      setSelectedProposalId(param);
    }
    if (view === 'blueprint' && param) {
      setActiveBlueprintSha(param);
    }
    if (view !== 'proposal-detail') {
      // scroll to top on major view switch
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProposal = (id: string) => {
    setSelectedProposalId(id);
    setActiveView('proposal-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleUpvote = (id: string) => {
    sovereignStore.toggleUpvote(id);
  };

  const handleToggleCommentHelpful = (proposalId: string, commentId: string) => {
    sovereignStore.toggleCommentHelpful(proposalId, commentId);
  };

  const handleAddComment = (
    proposalId: string,
    content: string,
    stance: CommentStanceType,
    evidenceUrl?: string
  ) => {
    sovereignStore.addComment(proposalId, content, stance, evidenceUrl);
  };

  const handleSynthesizeProposal = (proposalId: string) => {
    sovereignStore.synthesizeAndCommit(proposalId);
  };

  const unreadCount = storeState.notifications.filter((n) => !n.is_read).length;

  const activeProposal = selectedProposalId
    ? sovereignStore.getProposalById(selectedProposalId)
    : null;
  const activeProposalComments = selectedProposalId
    ? sovereignStore.getComments(selectedProposalId)
    : [];
  const activeMinistry = activeProposal
    ? sovereignStore.getMinistryBySlug(activeProposal.ministry_slug)
    : undefined;

  const t = I18N[currentLocale];

  return (
    <div className="min-h-screen bg-[#0B131B] text-slate-100 flex flex-col font-sans">
      {/* Top Sovereignty Banner */}
      <div className="bg-[#006A4E] text-white text-[11px] font-mono px-4 py-1 text-center font-bold tracking-wider flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        <span>REPUBLIC OF BANGLADESH • SOVEREIGN CIVIC INTELLIGENCE OS 2.0</span>
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        currentLocale={currentLocale}
        onLocaleChange={(loc) => setCurrentLocale(loc)}
        activeView={activeView}
        onNavigate={handleNavigate}
        session={storeState.session}
        onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
        unreadCount={unreadCount}
      />

      {/* View Routing Body */}
      <main className="flex-1">
        {/* 1. HOME VIEW */}
        {activeView === 'home' && (
          <div>
            <SovereignHero
              currentLocale={currentLocale}
              onNavigate={handleNavigate}
              totalProposalsCount={storeState.proposals.length}
            />

            <MinistryMatrix
              ministries={storeState.ministries}
              currentLocale={currentLocale}
              selectedMinistrySlug={selectedMinistrySlug}
              onSelectMinistry={(slug) => {
                setSelectedMinistrySlug(slug);
                const feedEl = document.getElementById('proposals-feed');
                if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProposalList
              proposals={storeState.proposals}
              ministries={storeState.ministries}
              currentLocale={currentLocale}
              selectedMinistrySlug={selectedMinistrySlug}
              onClearMinistryFilter={() => setSelectedMinistrySlug(null)}
              onSelectProposal={handleSelectProposal}
              onToggleUpvote={handleToggleUpvote}
              onCreateNewClick={() => handleNavigate('new-proposal')}
            />
          </div>
        )}

        {/* 2. 24 MINISTRIES MATRIX VIEW */}
        {activeView === 'ministries' && (
          <div>
            <MinistryMatrix
              ministries={storeState.ministries}
              currentLocale={currentLocale}
              selectedMinistrySlug={selectedMinistrySlug}
              onSelectMinistry={(slug) => setSelectedMinistrySlug(slug)}
            />

            <ProposalList
              proposals={storeState.proposals}
              ministries={storeState.ministries}
              currentLocale={currentLocale}
              selectedMinistrySlug={selectedMinistrySlug}
              onClearMinistryFilter={() => setSelectedMinistrySlug(null)}
              onSelectProposal={handleSelectProposal}
              onToggleUpvote={handleToggleUpvote}
              onCreateNewClick={() => handleNavigate('new-proposal')}
            />
          </div>
        )}

        {/* 3. PROPOSAL STUDIO (4-STAGE GUIDED WIZARD) */}
        {activeView === 'new-proposal' && (
          <ProposalStudio
            ministries={storeState.ministries}
            currentLocale={currentLocale}
            session={storeState.session}
            onSuccessViewProposal={(id) => handleSelectProposal(id)}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {/* 4. PROPOSAL DEEP DELIBERATION VIEW */}
        {activeView === 'proposal-detail' && activeProposal && (
          <ProposalDetail
            proposal={activeProposal}
            comments={activeProposalComments}
            ministry={activeMinistry}
            currentLocale={currentLocale}
            session={storeState.session}
            onBack={() => handleNavigate('home')}
            onToggleUpvote={handleToggleUpvote}
            onToggleCommentHelpful={handleToggleCommentHelpful}
            onAddComment={handleAddComment}
            onSynthesizeToOS={(id) => {
              handleSynthesizeProposal(id);
              handleNavigate('synthesis');
            }}
            onNavigateToBlueprint={(sha) => handleNavigate('blueprint', sha)}
          />
        )}

        {/* 5. MASTER BLUEPRINT OS (GIT VIEWER) */}
        {activeView === 'blueprint' && (
          <MasterBlueprintViewer
            commits={storeState.commits}
            currentLocale={currentLocale}
            activeCommitSha={activeBlueprintSha}
            onNavigateToProposal={handleSelectProposal}
          />
        )}

        {/* 6. ANONYMOUS ALERT INBOX */}
        {activeView === 'inbox' && (
          <AnonymousAlertHub
            notifications={storeState.notifications}
            currentLocale={currentLocale}
            session={storeState.session}
            onSelectProposal={handleSelectProposal}
            onNavigateToBlueprint={() => handleNavigate('blueprint')}
          />
        )}

        {/* 7. NATIONAL ASSEMBLY AI SYNTHESIS PORTAL */}
        {activeView === 'synthesis' && (
          <AssemblySynthesisPortal
            proposals={storeState.proposals}
            ministries={storeState.ministries}
            currentLocale={currentLocale}
            onSynthesizeProposal={handleSynthesizeProposal}
            onNavigateToBlueprint={(sha) => handleNavigate('blueprint', sha)}
            onSelectProposal={handleSelectProposal}
          />
        )}
      </main>

      {/* Identity Session Modal */}
      <IdentityModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        currentSession={storeState.session}
        onUpdateSession={(newSession) => sovereignStore.setSession(newSession)}
        currentLocale={currentLocale}
      />

      {/* Sovereign Footer */}
      <footer className="bg-[#080E14] border-t border-slate-800/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#006A4E] text-white flex items-center justify-center font-bold text-[10px]">
              ২.০
            </div>
            <span className="font-mono text-slate-300 font-bold">
              BANGLADESH 2.0 • Sovereign Civic-Intelligence OS
            </span>
          </div>

          <div className="font-mono text-[11px] text-slate-500 text-center sm:text-right">
            <span>{t.footer_audit}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
