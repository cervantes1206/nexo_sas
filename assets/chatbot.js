(function(){
  const NEXO_EMAIL = "contacto@nexosas.com";

  const KB = [
    { keys:["software","producto","herramienta","módulo","modulo"],
      reply:"Desarrollamos seis frentes de software: Calificaciones, Asistencia, Asistente de planeación con IA, LMS personalizado con IA, Gestión administrativa (inventarios y talento humano) y un Asistente de IA transversal. Puedes ver el detalle completo de cada uno en la página de Servicios.",
      quick:["Ver página de servicios","Agendar una cita"] },
    { keys:["calificaciones","nota","notas"],
      reply:"El módulo de Calificaciones digitaliza el registro y seguimiento académico: boletines automáticos, histórico por estudiante y acceso para acudientes.",
      quick:["Agendar una cita"] },
    { keys:["asistencia","ausentismo estudiantes"],
      reply:"El módulo de Asistencia registra la asistencia diaria (app o QR), genera alertas automáticas de inasistencia y alimenta al asistente de IA con esos datos.",
      quick:["Agendar una cita"] },
    { keys:["planeación","planeacion","clases"],
      reply:"El asistente de planeación con IA ayuda a los docentes a estructurar planes de clase alineados a estándares curriculares, con un banco de planeaciones reutilizable.",
      quick:["Agendar una cita"] },
    { keys:["lms","aprendizaje","virtual"],
      reply:"El LMS personalizado con IA se adapta a la identidad de cada institución, con rutas de contenido adaptativas y seguimiento del progreso por estudiante.",
      quick:["Agendar una cita"] },
    { keys:["inventario","administrativa","talento humano","ausentismo","asignación docente","asignacion docente"],
      reply:"Gestión administrativa cubre inventarios (control de activos y mantenimiento) y talento humano: asignación de carga docente y control de ausentismo.",
      quick:["Ver asesoría en talento humano","Agendar una cita"] },
    { keys:["ia","inteligencia artificial","chatbot","análisis de datos","analisis de datos"],
      reply:"El asistente de IA es transversal a todos los módulos: analiza los datos que se generan y se puede desplegar como chatbot institucional para estudiantes, familias o docentes — como este mismo chat.",
      quick:["Agendar una cita"] },
    { keys:["proceso","procesos","calidad","gestión educativa","gestion educativa"],
      reply:"En asesoría en gestión de procesos educativos hacemos diagnóstico institucional, análisis de encuestas y evaluaciones, reorganización de horarios y cargas académicas, e indicadores de calidad para rectoría.",
      quick:["Ver desarrollo de software","Agendar una cita"] },
    { keys:["talento humano","docente","personal","rrhh","recursos humanos"],
      reply:"En asesoría en talento humano trabajamos asignación de carga docente basada en datos, control de ausentismo, indicadores de bienestar y rotación, y acompañamiento en selección y perfilamiento docente.",
      quick:["Agendar una cita"] },
    { keys:["equipo","quienes son","quiénes son","fundadores"],
      reply:"Nexo lo integran Jairo Jaraba Galván (Magíster en Administración de Centros Educativos) y Javier Cervantes (analista de datos, ingeniero en desarrollo de software y psicólogo educativo).",
      quick:["Ver equipo","Agendar una cita"] },
    { keys:["precio","costo","cuánto cuesta","cuanto cuesta","tarifa","valor"],
      reply:"El costo depende del tamaño de la institución y los módulos que necesites. Lo más útil es agendar una llamada breve para entender tu contexto y darte una propuesta concreta.",
      quick:["Agendar una cita"] },
    { keys:["contacto","correo","email","teléfono","telefono"],
      reply:"Puedes escribirnos a " + NEXO_EMAIL + ", o te ayudo a agendar una cita desde aquí mismo.",
      quick:["Agendar una cita"] },
  ];

  const GREETING = "Hola, soy el asistente virtual de Nexo. Puedo resolver dudas sobre nuestros servicios o ayudarte a agendar una cita. ¿Qué necesitas?";
  const GREETING_QUICK = ["Ver página de servicios","Ver equipo","Agendar una cita"];

  function injectMarkup(){
    const toggle = document.createElement('button');
    toggle.id = 'chat-toggle';
    toggle.setAttribute('aria-label','Abrir asistente de Nexo');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML = '<i class="ti ti-message-chatbot" aria-hidden="true"></i><span class="badge" id="chat-badge"></span>';
    document.body.appendChild(toggle);

    const win = document.createElement('div');
    win.id = 'chat-window';
    win.setAttribute('role','dialog');
    win.setAttribute('aria-label','Asistente virtual Nexo');
    win.setAttribute('aria-hidden','true');
    win.innerHTML =
      '<div class="chat-head">' +
        '<svg viewBox="6 10 76 76" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<rect x="10" y="54" width="28" height="28" rx="6" fill="#8ecae6"/>' +
          '<rect x="30" y="34" width="28" height="28" rx="6" fill="#219ebc"/>' +
          '<rect x="50" y="14" width="28" height="28" rx="6" fill="#fb8500"/>' +
        '</svg>' +
        '<div><h4>Asistente Nexo</h4><p>Resuelve dudas o agenda una cita</p></div>' +
        '<button id="chat-close" aria-label="Cerrar chat"><i class="ti ti-x"></i></button>' +
      '</div>' +
      '<div class="chat-body" id="chat-body"></div>' +
      '<form class="chat-input" id="chat-form">' +
        '<input type="text" id="chat-input" placeholder="Escribe tu pregunta..." autocomplete="off" aria-label="Escribe tu mensaje">' +
        '<button type="submit" aria-label="Enviar"><i class="ti ti-send"></i></button>' +
      '</form>';
    document.body.appendChild(win);
  }

  injectMarkup();

  const toggle = document.getElementById('chat-toggle');
  const win = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const body = document.getElementById('chat-body');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const badge = document.getElementById('chat-badge');

  let booking = null;

  function addMsg(text, who, quickReplies){
    const m = document.createElement('div');
    m.className = 'msg ' + who;
    m.textContent = text;
    body.appendChild(m);
    if(quickReplies && quickReplies.length){
      const qr = document.createElement('div');
      qr.className = 'quick-replies';
      quickReplies.forEach(q=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = q;
        b.addEventListener('click', ()=> handleUserText(q));
        qr.appendChild(b);
      });
      body.appendChild(qr);
    }
    body.scrollTop = body.scrollHeight;
  }

  function openChat(){
    win.classList.add('open');
    win.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    badge.style.display = 'none';
    if(!body.dataset.started){
      body.dataset.started = '1';
      addMsg(GREETING, 'bot', GREETING_QUICK);
    }
    input.focus();
  }
  function closeChat(){
    win.classList.remove('open');
    win.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
  }
  toggle.addEventListener('click', ()=> win.classList.contains('open') ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  function startBooking(){
    booking = { step:'name', data:{} };
    addMsg("Perfecto, agendemos una cita. ¿Cuál es tu nombre?", 'bot');
  }

  function bookingStep(text){
    const d = booking.data;
    if(booking.step === 'name'){
      d.name = text; booking.step = 'email';
      addMsg("Gracias, " + text.split(' ')[0] + ". ¿Cuál es tu correo electrónico?", 'bot');
      return;
    }
    if(booking.step === 'email'){
      d.email = text; booking.step = 'institucion';
      addMsg("¿En qué institución educativa trabajas?", 'bot');
      return;
    }
    if(booking.step === 'institucion'){
      d.institucion = text; booking.step = 'fecha';
      addMsg("¿Qué día y horario te funcionan mejor para la llamada? (por ejemplo: martes en la tarde)", 'bot');
      return;
    }
    if(booking.step === 'fecha'){
      d.fecha = text; booking.step = 'motivo';
      addMsg("Por último, cuéntame brevemente qué te gustaría revisar en la cita.", 'bot');
      return;
    }
    if(booking.step === 'motivo'){
      d.motivo = text; booking.step = 'done';
      try{
        const log = JSON.parse(localStorage.getItem('nexo_appointment_requests') || '[]');
        log.push({ ...d, creado: new Date().toISOString() });
        localStorage.setItem('nexo_appointment_requests', JSON.stringify(log));
      }catch(e){}

      const subject = encodeURIComponent("Solicitud de cita - Nexo SAS");
      const bodyText = encodeURIComponent(
        "Nombre: " + d.name + "\n" + "Correo: " + d.email + "\n" +
        "Institución: " + d.institucion + "\n" + "Disponibilidad: " + d.fecha + "\n" + "Motivo: " + d.motivo
      );
      const mailto = "mailto:" + NEXO_EMAIL + "?subject=" + subject + "&body=" + bodyText;

      addMsg("Listo, " + d.name.split(' ')[0] + ". Resumen de tu solicitud:\n\nCorreo: " + d.email + "\nInstitución: " + d.institucion + "\nDisponibilidad: " + d.fecha + "\nMotivo: " + d.motivo, 'bot');

      const m = document.createElement('div');
      m.className = 'msg bot';
      const a = document.createElement('a');
      a.href = mailto;
      a.textContent = "Confirmar y enviar solicitud por correo →";
      a.className = "msg-link";
      m.appendChild(a);
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      booking = null;
      return;
    }
  }

  function matchKB(text){
    const t = text.toLowerCase();
    for(const item of KB){ if(item.keys.some(k => t.includes(k))) return item; }
    return null;
  }

  function handleUserText(text){
    addMsg(text, 'user');
    input.value = '';
    if(booking){ bookingStep(text); return; }

    const t = text.toLowerCase();
    if(t.includes('cita') || t.includes('agendar') || t.includes('reunión') || t.includes('reunion') || t.includes('llamada')){
      startBooking(); return;
    }
    if(t.includes('página de servicios') || t.includes('pagina de servicios')){
      addMsg("Puedes ver el desglose completo en la página de Servicios, en el menú superior.", 'bot', ["Agendar una cita"]);
      return;
    }
    if(t.includes('ver equipo')){
      addMsg("Puedes conocer al equipo completo en la página de Equipo, en el menú superior.", 'bot', ["Agendar una cita"]);
      return;
    }

    const hit = matchKB(text);
    if(hit){ addMsg(hit.reply, 'bot', hit.quick); }
    else {
      addMsg("No estoy seguro de haber entendido bien. Puedo contarte sobre nuestro software, nuestras asesorías, el equipo, o ayudarte a agendar una cita directamente.", 'bot', GREETING_QUICK);
    }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    handleUserText(text);
  });
})();
