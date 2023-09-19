<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <title>Donas do Ninho</title>
</head>

<body>
    <div class="page">
        <header>
            <img src="../img/logoDonasDoNinho.svg" alt="Logo Donas do Ninho">
        </header>
        <main>
            <form action="" method="post" id="formCadastro">
                <div class="inputGroup">
                    <label for="nome"> Nome completo </label>
                    <input type="text" name="nome" id="nome" placeholder="Digite seu nome" oninput="nomeValidation()" class="required">
                    <span class="span-required">Limite de 100 caracteres</span>
                </div>
                <div class="inputGroup">
                    <label for="dataNascimento"> Data de nascimento </label>
                    <input type="text" name="dataNascimento" id="dataNascimento" placeholder="dd/mm/aaaa" oninput="dataValidation()" class="required"
                    onmouseover="(this.type='date')">
                    <span class="span-required">Informe uma data acima de 1900</span>
                </div>
                <div class="inputGroup">
                    <label for="selecione"> Selecione </label>
                    <select name="tipoMãe">
                        <option value="mãe">Mãe</option>
                        <option value="gestante">Gestante</option>
                        <option value="nãoSouMãe">Não sou mãe</option>
                    </select>
                </div>
                <div class="inputGroup">
                    <label for="newEmail"> Email </label>
                    <input type="email" name="newEmail" id="newEmail" placeholder="exemplo@email.com"  class="required" oninput="emailValidateCadastro()"/>
                    <span class="span-required">Tipo de email inválido</span>
                  </div>
                  <div class="inputGroup">
                    <label for="newSenha"> Senha </label>
                    <input type="password" name="newSenha" id="newSenha" placeholder="Digite sua senha" class="required" oninput="mainPasswordValidate()">
                    <span class="span-required">A senha deve conter no minímo 8 caracteres</span>
                  </div>
                  <div class="inputGroup">
                    <label for="cofirmSenha"> Confirmar sua senha </label>
                    <input type="password" name="confirmSenha" id="confirmSenha" placeholder="Confirme sua senha" class="required" oninput="comparePassword()"/>
                    <span class="span-required">As senhas devem ser as mesmas</span>
                  </div>
            </form>
        </main>
        <footer>
            <button type="submit" id="btnCadInfo" class="btn">Avançar</button>
        </footer>
    </div>
</body>
<script src="../js/script.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js"></script> 
<script src="https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore-compat.js"></script> 
<script src="https://www.gstatic.com/firebasejs/10.3.0/firebase-auth-compat.js"></script>
<script src="../js/firebase-init.js"></script>
</html>