import React, { useState } from "react";
import LivroCard from "./LivroCard";
import { apiURL, authHeader } from "../config/key";
import "./pesquisa.css";

const Pesquisa = ({ livros, moverLivro, adicionarLivro }) => {
  const [resultadoBusca, setResultadoBusca] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarLivros = async (query) => {
    if (!query.trim()) {
      setResultadoBusca([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiURL}?q=${query}`, {
        headers: authHeader,
      });
      const data = await response.json();
      setResultadoBusca(data);
    } catch (error) {
      console.error("Erro ao encontrar livros:", error);
      setResultadoBusca([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setBusca(query);
    // Não acionar a busca no evento de digitação, vamos deixar o botão fazer isso.
  };

  const handleSearchClick = () => {
    buscarLivros(busca); // Chama a função de busca quando o botão é clicado
  };

  return (
    <div className="pesquisa-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Encontrar livros..."
          value={busca}
          onChange={handleChange}
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          Buscar
        </button>
        {loading && <span className="loading-text">Carregando...</span>}
      </div>

      {busca && !loading && (
        <div className="resultado-busca">
          {resultadoBusca.length > 0 ? (
            resultadoBusca.map((livro) => {
              const livroExistente = livros.find((l) => l.id === livro.id);
              return (
                <LivroCard
                  key={livro.id}
                  livro={livroExistente || livro}
                  moverLivro={moverLivro}
                  adicionarLivro={adicionarLivro}
                />
              );
            })
          ) : (
            <p className="no-results">Nenhum livro encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Pesquisa;
