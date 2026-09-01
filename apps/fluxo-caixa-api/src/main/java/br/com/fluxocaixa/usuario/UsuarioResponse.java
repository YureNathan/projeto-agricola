package br.com.fluxocaixa.usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(

        Long id,
        Long empresaId,
        String nomeEmpresa,
        String nome,
        String email,
        String telefone,
        PapelUsuario papel,
        boolean ativo,
        boolean emailVerificado,
        boolean agriculturaAtiva,
        boolean pecuariaAtiva,
        LocalDateTime criadoEm

) {

    public static UsuarioResponse de(Usuario usuario) {

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getEmpresa().getId(),
                usuario.getEmpresa().getNome(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getPapel(),
                usuario.isAtivo(),
                usuario.isEmailVerificado(),
                usuario.getEmpresa()
                        .isAgriculturaAtiva(),
                usuario.getEmpresa()
                        .isPecuariaAtiva(),
                usuario.getCriadoEm()
        );
    }
}