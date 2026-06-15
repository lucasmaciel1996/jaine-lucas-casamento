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
  const [convidados, setConvidados] = useState("");

  useEffect(() => {
    setIsLoaded(true);
    const params = new URLSearchParams(window.location.search);
    const paramConvidados = params.get("convidados");
    if (paramConvidados) setConvidados(paramConvidados.trim());

    if (isModalOpen) {
      document.body.classList.add("has-modal");
    } else {
      document.body.classList.remove("has-modal");
    }
  }, [isModalOpen]);

  const invitationText = () => {
    if (!convidados) {
      return "Convidamos você para celebrar conosco este momento tão especial de amor, união e felicidade.";
    }
    
    const names = convidados.split(",").map(n => n.trim()).filter(Boolean);
    const formattedNames = names.reduce((acc, name, i) => {
      if (i === 0) return name;
      if (i === names.length - 1) return `${acc} e ${name}`;
      return `${acc}, ${name}`;
    }, "");

    if (names.length >= 2) {
      return `Convidamos vocês, ${formattedNames}, para celebrar conosco este momento tão especial de amor, união e felicidade.`;
    }
    return `${formattedNames}, convidamos você para celebrar conosco este momento tão especial de amor, união e felicidade.`;
  };

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.add("is-loaded");
    }
  }, [isLoaded]);

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
    <>
      <div className="loader" aria-label="Carregando convite">
        <div className="loader__mark" aria-hidden="true">
          JL
        </div>
      </div>

      <main className="page-shell">
        <section className="hero" aria-labelledby="titulo-convite">
          <div className="hero__media" aria-label="Foto de Jaine e Lucas">
            <img
              src="https://img.lucaszavaskiimoveis.com.br/1781287317544-h5rSA7i-1781287316139-QDPMXSR.webp"
              alt="Jaine e Lucas à beira do rio"
            />
          </div>

          <div className="hero__content">
            <p className="eyebrow">Convite de casamento</p>
            <div className="monogram" aria-hidden="true">
              JL
            </div>

            <h1 id="titulo-convite">Jaine e Lucas</h1>

            <p className="blessing">Com a bênção de Deus e de nossos pais</p>

            <div className="parents" aria-label="Pais dos noivos">
              <p>
                Maria Janete Kostulski Nizelski
                <br />
                Nézio Nizelski
              </p>
              <p>
                Rosalina Alves dos Santos Maciel
                <br />
                Francisco de Assis Maciel
              </p>
            </div>

            <p className="invitation-text">{invitationText()}</p>
          </div>
        </section>

        <section className="details" aria-label="Informações do casamento">
          <article className="date-panel">
            <p className="weekday">Sábado</p>
            <div className="date-line">
              <span>setembro</span>
              <strong>05</strong>
              <span>2026</span>
            </div>
            <p className="time">às 16 horas</p>
          </article>

          <article className="info-panel">
            <span className="info-label">Cerimônia e recepção</span>
            <h2>Associação Recreativa Esportiva Procopiak</h2>
            <p>
              <a
                href="https://maps.app.goo.gl/iBaeR857tWZyjAwt8"
                target="_blank"
                rel="noopener noreferrer"
              >
                AREP, em Canoinhas
              </a>
            </p>
          </article>

          <article className="info-panel">
            <span className="info-label">Com carinho</span>
            <h2>Sua presença é o que mais importa para nós.</h2>
            <p>
              Caso deseje nos presentear, teremos envelopes e uma caixinha à
              disposição no dia do evento.
            </p>
          </article>
        </section>

        <section className="rsvp" aria-label="Confirmação de presença">
          <div>
            <span className="info-label">Confirmação</span>
            <h2>Confirme sua presença para celebrarmos juntos.</h2>
          </div>
          <button
            type="button"
            className="rsvp-button"
            onClick={() => setIsModalOpen(true)}
          >
            Confirmar presença
          </button>
        </section>

        <section className="quote" aria-label="Mensagem dos noivos">
          <p>
            Como rios que se unem ao mar,
            <br />
            escolhemos caminhar juntos
            <br />
            guiados pelo amor.
          </p>
        </section>
      </main>

      {/* RSVP Modal */}
      <div className="modal" aria-hidden={!isModalOpen}>
        <div className="modal__backdrop" onClick={() => setIsModalOpen(false)} />
        <div className="modal__dialog">
          <button
            type="button"
            className="modal__close"
            aria-label="Fechar"
            onClick={() => setIsModalOpen(false)}
          >
            &times;
          </button>

          <span className="info-label">Confirmação de presença</span>
          <h2 id="rsvp-title">Informe seus dados</h2>

          <form onSubmit={handleSubmit} className="rsvp-form">
            <label>
              Nome completo
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleInputChange}
              />
            </label>

            <fieldset>
              <legend>Você irá ao evento?</legend>
              <label className="radio-option">
                <input
                  type="radio"
                  name="presenca"
                  value="Sim"
                  checked={formData.presenca === "Sim"}
                  onChange={handleInputChange}
                />
                Sim
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="presenca"
                  value="Não"
                  checked={formData.presenca === "Não"}
                  onChange={handleInputChange}
                />
                Não
              </label>
            </fieldset>

            <div className="form-grid">
              <label>
                Quantidade de adultos incluindo você
                <input
                  type="number"
                  name="adultos"
                  min="0"
                  inputMode="numeric"
                  required
                  value={formData.adultos}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Quantidade de crianças
                <input
                  type="number"
                  name="criancas"
                  min="0"
                  inputMode="numeric"
                  value={formData.criancas}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <label>
              Telefone
              <input
                type="tel"
                name="telefone"
                required
                inputMode="tel"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Observações
              <textarea
                name="observacoes"
                rows={4}
                value={formData.observacoes}
                onChange={handleInputChange}
              />
            </label>

            <button
              type="submit"
              className="rsvp-button rsvp-button--wide"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar confirmação"}
            </button>

            {status.message && (
              <p className="form-status" style={{ color: status.isError ? 'red' : 'inherit' }}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
