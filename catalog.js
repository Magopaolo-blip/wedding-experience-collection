
(() => {
  const body = document.body;
  const lang = body.dataset.lang || 'it';
  const base = body.dataset.assetBase || '';
  const pages = Array.from({length:13}, (_,i) => `${base}catalogo-${String(i+1).padStart(2,'0')}.jpg`);
  const titles = lang === 'en'
    ? ["Cover","Magic Umbrellas","Magic Cabaret","Bubble Show","Mentalism","Comedy Waiters","Frequency Architect","Close-Up","Kids Magic","Paolo Musetti","Bubble Bar","Street Bubbles","Timing and contacts"]
    : ["Copertina","Magic Umbrellas","Magic Cabaret","Bubble Show","Mentalismo","Finti Camerieri","Architetto delle Frequenze","Close Up","Kids Magic","Paolo Musetti","Bubble Bar","Street Bubbles","Durate e contatti"];
  const links = {"2": [{"href": "https://drive.google.com/file/d/1MOcPARYmxQYIaZp3MfnORh7obMOrWhmG/view?usp=sharing", "left": 62.6659, "top": 73.3478, "width": 10.1552, "height": 2.7718}], "3": [{"href": "https://drive.google.com/file/d/1FgH2v9AbpO5wbFTe5sXxyKm2oSCL4Gg4/view?usp=sharing", "left": 6.3081, "top": 73.752, "width": 10.1552, "height": 2.7718}], "4": [{"href": "https://drive.google.com/file/d/1RihL7s6Jt4Jf6_ymqgrqBm5y53btkLgF/view?usp=sharing", "left": 62.4844, "top": 81.5766, "width": 10.1552, "height": 2.7718}], "5": [{"href": "https://drive.google.com/file/d/1kToLoyj857L31rC11zOBRrIBOcyCRk6Y/view?usp=sharing", "left": 63.7377, "top": 74.3157, "width": 10.1552, "height": 2.7718}], "6": [{"href": "https://drive.google.com/file/d/1c02ClIu7dnx792oyDcMI-OG1jXLXnuyz/view?usp=sharing", "left": 7.0703, "top": 71.0595, "width": 10.1552, "height": 2.7718}], "7": [{"href": "https://drive.google.com/file/d/1EQwlMsggwBlGgInosMoeniCQXhCPwUDH/view?usp=sharing", "left": 7.0703, "top": 72.3662, "width": 10.1552, "height": 2.7718}, {"href": "https://www.instagram.com/reel/DLmGccmyeDp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", "left": 7.0703, "top": 75.516, "width": 5.1667, "height": 2.7718}], "8": [{"href": "https://drive.google.com/file/d/1XHORVC3PAyxxtZnFb9vpwBR8CwitTbhr/view?usp=sharing", "left": 63.7377, "top": 83.7054, "width": 10.1552, "height": 2.7718}], "9": [{"href": "https://drive.google.com/file/d/1YSpNzdgmI4O1N9kdtbPL-nRYAR427O3f/view?usp=sharing", "left": 7.0703, "top": 74.8337, "width": 10.1552, "height": 2.7718}], "10": [{"href": "https://drive.google.com/file/d/1YSpNzdgmI4O1N9kdtbPL-nRYAR427O3f/view?usp=sharing", "left": 7.0703, "top": 73.3342, "width": 10.1552, "height": 2.7718}, {"href": "https://drive.google.com/file/d/13290i22vLjvXExlEpHbLciubMnm2eQ1j/view?usp=sharing", "left": 7.0703, "top": 76.484, "width": 16.7472, "height": 2.7718}], "11": [{"href": "https://drive.google.com/file/d/1TCLYp6oVrn9DKOkS0bGkDYibrXzf1nna/view?usp=sharing", "left": 7.0703, "top": 77.729, "width": 10.1552, "height": 2.7718}]};
  let index = 0;
  const page = document.getElementById('page');
  const layer = document.getElementById('linkLayer');
  const title = document.getElementById('pageName');
  const counter = document.getElementById('counter');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');

  function addHotspots(target, number) {
    target.innerHTML = '';
    (links[String(number)] || []).forEach(item => {
      const a = document.createElement('a');
      a.className = 'hotspot';
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = lang === 'en' ? 'Watch the linked video' : 'Guarda il video collegato';
      a.setAttribute('aria-label', `${a.title} — ${number}`);
      ['left','top','width','height'].forEach(k => a.style[k] = item[k] + '%');
      target.appendChild(a);
    });
  }
  function render() {
    if (!page) return;
    page.src = pages[index];
    page.alt = `${lang === 'en' ? 'Portfolio page' : 'Pagina del catalogo'} ${index+1}: ${titles[index]}`;
    title.textContent = titles[index];
    counter.textContent = lang === 'en' ? `Page ${index+1} of ${pages.length}` : `Pagina ${index+1} di ${pages.length}`;
    prev.disabled = index === 0;
    next.disabled = index === pages.length - 1;
    addHotspots(layer, index + 1);
  }
  prev?.addEventListener('click', () => { if(index>0){index--;render();} });
  next?.addEventListener('click', () => { if(index<pages.length-1){index++;render();} });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prev?.click();
    if (e.key === 'ArrowRight') next?.click();
  });
  const mobile = document.getElementById('mobileCatalog');
  if (mobile) {
    pages.forEach((src,i) => {
      const wrap = document.createElement('article');
      wrap.className = 'mobile-page';
      const img = document.createElement('img');
      img.loading = i < 2 ? 'eager' : 'lazy';
      img.src = src;
      img.alt = `${lang === 'en' ? 'Portfolio page' : 'Pagina del catalogo'} ${i+1}: ${titles[i]}`;
      const hot = document.createElement('div');
      hot.className = 'link-layer';
      addHotspots(hot, i+1);
      const label = document.createElement('span');
      label.className = 'mobile-page-label';
      label.textContent = `${i+1} / ${pages.length} · ${titles[i]}`;
      wrap.append(img, hot, label);
      mobile.appendChild(wrap);
    });
    const end = document.createElement('div');
    end.className='mobile-end';
    const a=document.createElement('a');
    a.href = lang === 'en' ? './' : './';
    a.textContent = lang === 'en' ? 'Back to Italian Wedding Entertainment' : 'Torna a Italian Wedding Entertainment';
    end.appendChild(a); mobile.appendChild(end);
  }
  render();
})();
