/* =========================================================
   SALÃO DA ANDREIA — SCRIPT PRINCIPAL
   Índice:
   1. Configurações gerais (WhatsApp, seletor de elementos)
   2. Cabeçalho: sombra ao rolar
   3. Menu mobile (hambúrguer)
   4. Navegação suave + fechamento automático do menu
   5. Botões de agendamento -> WhatsApp
   6. Galeria: troca de abas com fotos do espaço
   7. Animações de entrada ao rolar (Intersection Observer)
   8. Ano dinâmico no rodapé
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. CONFIGURAÇÕES GERAIS ---------- */
  // ATENÇÃO: troque pelo número real do salão no formato internacional, sem espaços ou símbolos.
  const WHATSAPP_NUMBER = '5519996536276';
  const WHATSAPP_MESSAGE =
    'Olá, Andreia! Gostaria de agendar um horário no salão. Poderia me ajudar com a disponibilidade?';

  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  /* ---------- 2. CABEÇALHO: SOMBRA AO ROLAR ---------- */
  const toggleHeaderState = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* ---------- 3. MENU MOBILE (HAMBÚRGUER) ---------- */
  const openMenu = () => {
    mobileMenu.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // trava o scroll do fundo
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  /* ---------- 4. NAVEGAÇÃO SUAVE + FECHAMENTO DO MENU ---------- */
  // Fecha o menu mobile automaticamente ao clicar em qualquer link interno
  document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Realça o link do menu correspondente à seção visível (nav ativo)
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const highlightActiveLink = () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) currentId = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${currentId}`
        ? 'var(--gold-bright)'
        : '';
    });
  };
  window.addEventListener('scroll', highlightActiveLink, { passive: true });

  /* ---------- 5. BOTÕES DE AGENDAMENTO -> WHATSAPP ---------- */
  const openWhatsapp = (event) => {
    event.preventDefault();
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Botão da seção final de agendamento
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) whatsappBtn.addEventListener('click', openWhatsapp);

  // Botão flutuante fixo
  const floatWhatsapp = document.getElementById('floatWhatsapp');
  if (floatWhatsapp) floatWhatsapp.addEventListener('click', openWhatsapp);

  /* ---------- 6. GALERIA: TROCA DE ABAS ---------- */
  const galleryTabs = document.querySelectorAll('.gallery__tab');
  const galleryPanels = document.querySelectorAll('.gallery__panel');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Atualiza o estado visual das abas
      galleryTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      // Mostra apenas o painel de fotos correspondente à aba clicada
      galleryPanels.forEach(panel => {
        const isTarget = panel.id === `tab-${target}`;
        panel.classList.toggle('is-active', isTarget);

        // Como painéis ocultos (display:none) não disparam o Intersection Observer,
        // garantimos que as fotos apareçam assim que a aba for aberta.
        if (isTarget) {
          panel.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        }
      });
    });
  });

  /* ---------- 7. ANIMAÇÕES DE ENTRADA AO ROLAR ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Pequeno atraso escalonado para um efeito de entrada mais elegante
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- 8. ANO DINÂMICO NO RODAPÉ ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});