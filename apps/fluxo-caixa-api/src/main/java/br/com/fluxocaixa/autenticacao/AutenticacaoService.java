package br.com.fluxocaixa.autenticacao;

import br.com.fluxocaixa.usuario.EntrarRequest;
import br.com.fluxocaixa.usuario.EntrarResponse;
import br.com.fluxocaixa.usuario.Usuario;
import br.com.fluxocaixa.usuario.UsuarioRepository;
import br.com.fluxocaixa.usuario.UsuarioResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AutenticacaoService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional(readOnly = true)
    public EntrarResponse entrar(
            EntrarRequest request) {

        String email = normalizarEmail(
                request.email()
        );

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(email)
                .filter(Usuario::isAtivo)
                .orElseThrow(
                        CredenciaisInvalidasException::new
                );

        boolean senhaCorreta = passwordEncoder.matches(
                request.senha(),
                usuario.getSenhaHash()
        );

        if (!senhaCorreta) {
            throw new CredenciaisInvalidasException();
        }

        String token =
                tokenService.gerarToken(usuario);

        return new EntrarResponse(
                token,
                "Bearer",
                tokenService.getExpiracaoEmSegundos(),
                UsuarioResponse.de(usuario)
        );
    }

    private String normalizarEmail(String email) {

        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}