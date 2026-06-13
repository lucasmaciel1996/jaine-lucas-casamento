import { useState, useEffect } from "react";

const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwhU31vwyfHqVgjfKGsZ12J9zzYIsFTSgvmZuvIvRBjkrIm_yDaVx_FMLQbJiC0x5E/exec";

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ message: "", isError: false });
  const [formData, setFormData] = useState({
    nome: "",
    presenca: "Sim",
    adultos: "1",
    criancas: "0",
    telefone: "",
    observacoes: "",
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "", isError: false });

    const confirmation = {
      name: formData.nome.trim(),
      phone: formData.telefone.trim(),
      confirmed: formData.presenca === "Sim",
      adult_quantity: Number(formData.adultos),
      child_quantity: Number(formData.criancas || 0),
      observation: formData.observacoes.trim(),
    };

    try {
      const body = JSON.stringify(confirmation);
      try {
        const response = await fetch(RSVP_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body,
        });
        if (!response.ok) throw new Error("Erro ao enviar confirmação.");
      } catch (error) {
        if (!(error instanceof TypeError)) throw error;
        await fetch(RSVP_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body,
        });
      }

      setStatus({
        message: "Presença confirmada com sucesso! ❤️",
        isError: false,
      });
      setFormData({
        nome: "",
        presenca: "Sim",
        adultos: "1",
        criancas: "0",
        telefone: "",
        observacoes: "",
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus({ message: "", isError: false });
      }, 2000);
    } catch (error) {
      setStatus({
        message: "Não foi possível enviar agora. Tente novamente.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-bg-main selection:bg-gold-elegant/20 selection:text-gold-elegant transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="max-w-[1200px] mx-auto px-4 py-12 md:py-20 flex flex-col gap-12 md:gap-20">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 bg-bg-card rounded-[24px] overflow-hidden border border-border-soft shadow-soft animate-fade-in">
          <div className="relative h-[400px] md:h-[700px] overflow-hidden">
            <img 
              src="/suave.png" 
              alt="Jaine e Lucas" 
              className="w-full h-full object-cover hero-image-filter scale-105 hover:scale-100 transition-fine"
            />
          </div>
          <div className="relative flex flex-col items-center justify-center p-8 md:p-16 text-center gap-6 overflow-hidden">
            {/* Decorative Shape */}
            <div className="absolute top-10 right-10 w-40 h-60 bg-gold-elegant/5 rounded-full blur-3xl -z-10 rotate-12" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-green-primary/5 rounded-full blur-3xl -z-10 -rotate-12" />
            
            <span className="font-inter text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] text-gold-elegant">
              Convite de Casamento
            </span>
            
            <div className="flex flex-col items-center">
              <span className="text-gold-elegant text-6xl md:text-8xl font-light leading-none mb-2">JL</span>
              <h1 className="text-hero font-light italic leading-[0.9] text-green-primary">
                Jaine e<br />Lucas
              </h1>
            </div>

            <p className="text-body font-light text-text-primary/80 max-w-[400px]">
              Com a bênção de Deus e de nossos pais
            </p>

            <div className="w-full h-px bg-border-soft my-4 max-w-[300px]" />

            <div className="flex flex-col gap-4 text-body italic font-light">
              <p>Maria Janete Kostulski Nizelski<br />Nézio Nizelski</p>
              <p>Rosalina Alves dos Santos Maciel<br />Francisco de Assis Maciel</p>
            </div>

            <p className="text-body font-light mt-4 max-w-[450px]">
              Convidamos você para celebrar conosco este momento tão especial de amor e união.
            </p>
          </div>
        </section>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in [animation-delay:200ms]">
          <article className="bg-bg-card p-10 md:p-12 rounded-[16px] border border-border-soft shadow-soft flex flex-col items-center justify-center text-center transition-fine hover:-translate-y-1">
            <span className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-gold-elegant mb-6">Sábado</span>
            <div className="flex items-center gap-6 border-y border-border-soft py-4 mb-6">
              <span className="font-inter text-[10px] uppercase tracking-widest">Setembro</span>
              <span className="text-gold-elegant text-6xl md:text-7xl font-light">05</span>
              <span className="font-inter text-[10px] uppercase tracking-widest">2026</span>
            </div>
            <span className="text-body font-light italic">às 16 horas</span>
          </article>

          <article className="bg-bg-card p-10 md:p-12 rounded-[16px] border border-border-soft shadow-soft flex flex-col items-start text-left transition-fine hover:-translate-y-1">
            <span className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-gold-elegant mb-6">Cerimônia e Recepção</span>
            <h2 className="text-3xl md:text-4xl text-green-primary font-light mb-4">Associação Recreativa Esportiva Procopiak</h2>
            <a 
              href="https://maps.app.goo.gl/iBaeR857tWZyjAwt8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold-elegant font-inter text-[11px] uppercase tracking-widest border-b border-gold-elegant/30 hover:border-gold-elegant transition-fine"
            >
              Ver no Mapa
            </a>
          </article>

          <article className="bg-bg-card p-10 md:p-12 rounded-[16px] border border-border-soft shadow-soft flex flex-col items-start text-left transition-fine hover:-translate-y-1">
            <span className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-gold-elegant mb-6">Com Carinho</span>
            <h2 className="text-3xl md:text-4xl text-green-primary font-light mb-4 leading-tight">Sua presença é o que mais importa para nós.</h2>
            <p className="text-body font-light text-text-primary/70">
              Caso deseje nos presentear, teremos envelopes e uma caixinha à disposição no dia do evento.
            </p>
          </article>
        </div>

        {/* RSVP Banner */}
        <section className="bg-bg-card p-10 md:p-16 rounded-[16px] border border-border-soft shadow-soft flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in [animation-delay:400ms]">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-gold-elegant mb-4">Confirmação</span>
            <h2 className="text-4xl md:text-5xl text-green-primary font-light">Confirme sua presença para celebrarmos juntos.</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-green-primary text-bg-main px-12 py-5 font-inter text-xs font-bold uppercase tracking-[0.2em] transition-fine hover:bg-green-primary/90 hover:-translate-y-0.5 shadow-soft active:translate-y-0"
          >
            Confirmar Presença
          </button>
        </section>

        {/* Quote Section */}
        <section className="py-20 md:py-32 text-center animate-fade-in [animation-delay:600ms]">
          <p className="text-highlight italic font-light text-green-primary max-w-[1000px] mx-auto leading-[1.1]">
            "Como rios que se unem ao mar, escolhemos caminhar juntos guiados pelo amor."
          </p>
        </section>
      </main>

      {/* RSVP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-[600px] bg-bg-card border border-border-soft rounded-[24px] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 fade-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-text-primary/40 hover:text-text-primary transition-fine"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <span className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-gold-elegant mb-4 block">R.S.V.P</span>
            <h2 className="text-4xl text-green-primary font-light mb-8">Confirmar Presença</h2>

            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="nome" className="font-inter text-[11px] uppercase tracking-widest text-text-primary/60">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-border-soft py-2 text-lg focus:outline-none focus:border-gold-elegant transition-fine"
                />
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-inter text-[11px] uppercase tracking-widest text-text-primary/60">Você irá ao evento?</span>
                <div className="flex gap-8">
                  {['Sim', 'Não'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="presenca"
                        value={opt}
                        checked={formData.presenca === opt}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border border-gold-elegant flex items-center justify-center transition-fine ${formData.presenca === opt ? 'bg-gold-elegant' : ''}`}>
                        {formData.presenca === opt && <div className="w-1.5 h-1.5 bg-bg-card rounded-full" />}
                      </div>
                      <span className="text-lg font-light">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="adultos" className="font-inter text-[11px] uppercase tracking-widest text-text-primary/60">Adultos</label>
                  <input
                    type="number"
                    id="adultos"
                    name="adultos"
                    min="1"
                    value={formData.adultos}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-border-soft py-2 text-lg focus:outline-none focus:border-gold-elegant transition-fine"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="criancas" className="font-inter text-[11px] uppercase tracking-widest text-text-primary/60">Crianças</label>
                  <input
                    type="number"
                    id="criancas"
                    name="criancas"
                    min="0"
                    value={formData.criancas}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-border-soft py-2 text-lg focus:outline-none focus:border-gold-elegant transition-fine"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="telefone" className="font-inter text-[11px] uppercase tracking-widest text-text-primary/60">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  required
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-border-soft py-2 text-lg focus:outline-none focus:border-gold-elegant transition-fine"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="observacoes" className="font-inter text-[11px] uppercase tracking-widest text-text-primary/60">Observações (Opcional)</label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  rows={2}
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-border-soft py-2 text-lg focus:outline-none focus:border-gold-elegant transition-fine resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 rounded-full bg-green-primary text-bg-main py-4 font-inter text-xs font-bold uppercase tracking-[0.2em] transition-fine hover:bg-green-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Enviar Confirmação"}
              </button>

              {status.message && (
                <p className={`text-center font-inter text-sm ${status.isError ? 'text-red-500' : 'text-green-700'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
