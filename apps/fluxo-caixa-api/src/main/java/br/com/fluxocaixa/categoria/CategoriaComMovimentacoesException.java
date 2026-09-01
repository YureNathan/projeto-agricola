package br.com.fluxocaixa.categoria;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CategoriaComMovimentacoesException
        extends RuntimeException {

    private static final DateTimeFormatter
            FORMATADOR_DATA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final LocalDate dataReavaliacao;

    public CategoriaComMovimentacoesException(
            String nomeCategoria,
            LocalDate dataReavaliacao) {

        super(
                "A categoria \""
                        + nomeCategoria
                        + "\" possui movimentações financeiras "
                        + "e não pode ser excluída agora. "
                        + "Ela foi arquivada para preservar "
                        + "o histórico. Aguarde até "
                        + dataReavaliacao.format(
                        FORMATADOR_DATA
                )
                        + " para revisar a exclusão."
        );

        this.dataReavaliacao = dataReavaliacao;
    }

    public LocalDate getDataReavaliacao() {
        return dataReavaliacao;
    }
}