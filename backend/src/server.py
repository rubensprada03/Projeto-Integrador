from fastapi import FastAPI, Depends, status, HTTPException, Response, File, UploadFile, Form
from fastapi.responses import FileResponse,JSONResponse
from typing import List
import os 
import uuid
from sqlalchemy.orm import Session
from src.schemas.schemas import Produto, Usuario
from src.schemas.schemas import *
from src.infra.sqlalchemy.config.database import get_db
from src.infra.sqlalchemy.repositorios.produto import RepositorioProduto
from src.infra.sqlalchemy.repositorios.repositorio_usuario import RepositorioUsuario
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from src.security import verify_password, criar_token_jwt
from fastapi.staticfiles import StaticFiles


app = FastAPI()

IMAGEDIR = "src/imagesProd/"

app.mount("/imagesProd", StaticFiles(directory=IMAGEDIR), name="images")

# Configurar origens permitidas (substitua * pelo seu domínio front-end)
origins = ["*"]

# Configurar middlewares para permitir CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# USUÁRIOS =>
# CRIAR USUARIO                                                    
@app.post('/usuario', status_code=status.HTTP_201_CREATED, tags=['Usuário'])
def criar_usuario(usuario: Usuario, session: Session = Depends(get_db)):
    if usuario.senha != usuario.confirmar_senha:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="As senhas não coincidem.")

    repo_usuario = RepositorioUsuario(session)
    usuario_criado = repo_usuario.criar(usuario)
    return usuario_criado

# LISTAR USUARIO
@app.get('/usuario', status_code=status.HTTP_200_OK, tags=['Usuário'])
def listar_usuario(session: Session = Depends(get_db)):
    usuario = RepositorioUsuario(session).listar()
    return usuario

# EDITAR USUARIO
import bcrypt


# Editar usuarios
@app.put('/usuario/{usuario_id}', status_code=status.HTTP_200_OK, tags=['Usuário'])
def editar_usuario(
    usuario_id: int,
    novo_usuario: dict,
    session: Session = Depends(get_db)
):
    repo_usuario = RepositorioUsuario(session)
    usuario_existente = repo_usuario.obter_por_id(usuario_id)

    if usuario_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

    campos_permitidos = {'nome', 'cpf', 'senha', 'grupo', 'status'}
    campos_para_atualizar = {campo: novo_usuario[campo] for campo in campos_permitidos if campo in novo_usuario}

    if 'senha' in campos_para_atualizar:
        senha = campos_para_atualizar.get('senha')
        senha_criptografada = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
        campos_para_atualizar['senha'] = senha_criptografada

    usuario_atualizado = repo_usuario.editar(usuario_existente, campos_para_atualizar)
    return usuario_atualizado




# DELETAR USUÁRIO
@app.delete('/usuario/{usuario_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Usuário'])
def excluir_usuario(usuario_id: int, session: Session = Depends(get_db)):
    repo_usuario = RepositorioUsuario(session)
    usuario_existente = repo_usuario.obter_por_id(usuario_id)

    if usuario_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

    repo_usuario.excluir(usuario_existente)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.headers["X-Message"] = "Usuário excluído com sucesso."
    return response



# Rota para autenticação de login
@app.post("/login", tags=['Usuário'])
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_db)):
    # Autentica as credenciais do usuário
    repo_usuario = RepositorioUsuario(session)
    user = repo_usuario.autenticar(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(status_code=403,
                            detail="Usuário não autorizado."
                           )
    
    if not user.status:  # Verifica se o status é False (usuário desativado)
        raise HTTPException(status_code=403,
                            detail="Usuário não autorizado."
                           )
    
    # Verifica se o grupo do usuário é igual a "admin"
    if user.grupo == "admin":
        if not user.status:  # Verifica se o status é False (usuário desativado)
            raise HTTPException(status_code=403,
                                detail="Usuário não autorizado."
                               )
    
    if user.id == 1:
        return {
            "access_token": criar_token_jwt(user.id),
            "token_type": "bearer",
        }
    
    return {
        "access_token": criar_token_jwt(user.id),
        "token_type": "bearer",
    }


# Editar status
@app.put('/usuario/{usuario_id}/status', status_code=status.HTTP_200_OK, tags=['Usuário'])
def alterar_status_usuario(usuario_id: int, status: bool, session: Session = Depends(get_db)):
    repo_usuario = RepositorioUsuario(session)
    usuario_existente = repo_usuario.obter_por_id(usuario_id)

    if usuario_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

    # Atualiza o status do usuário com o novo_status fornecido
    usuario_existente.status = status  # Alterado de novo_status para status
    session.commit()

    return {"message": "Status do usuário atualizado com sucesso"}
 

# ROTAS DE PRODUTOS=>

""" # Criar produto
@app.post("/produtos/", status_code=status.HTTP_201_CREATED)
def create_produto(produto: Produto, db: Session = Depends(get_db)):
    repo = RepositorioProduto(db)
    return repo.criar(produto) """



@app.post("/produtos/", status_code=status.HTTP_201_CREATED, tags=['Produto'])
async def create_produto_with_images(
    nome: str = Form(...),
    avaliacao: int = Form(...),
    descricao_detalhada: str = Form(...),
    preco: float = Form(...),
    qtd_estoque: int = Form(...),
    status: bool = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Cria o produto
    produto = ProdutoBase(
        nome=nome,
        avaliacao=avaliacao,
        descricao_detalhada=descricao_detalhada,
        preco=preco,
        qtd_estoque=qtd_estoque,
        status=status
    )
    repo_produto = RepositorioProduto(db)
    db_produto = repo_produto.criar(produto)

    # Salva as imagens
    image_urls = []

    for file in files:
        file.filename = f"{uuid.uuid4()}.jpg"
        contents = await file.read()

        # Salvar o arquivo
        with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
            f.write(contents)

        image_urls.append(f"{IMAGEDIR}{file.filename}")

    # Adicione as URLs das imagens ao campo 'imagens' do produto
    if db_produto.imagens:
        db_produto.imagens += ", " + ", ".join(image_urls)
    else:
        db_produto.imagens = ", ".join(image_urls)

    # Atualize o produto no banco de dados
    db.commit()
    db.refresh(db_produto)

    return db_produto



# Listar produto
@app.get('/produtos/', status_code=status.HTTP_200_OK, tags=['Produto'])
def listar_produto(session: Session = Depends(get_db)):
    produtos = RepositorioProduto(session).listar()
    produtos_com_imagens = []

    for produto in produtos:
        if produto.imagens:
            imagens = [f"{imagem.strip()}" for imagem in produto.imagens.split(',')]
            produto_dict = produto.__dict__
            produto_dict['imagens'] = imagens
            produtos_com_imagens.append(produto_dict)
        else:
            produtos_com_imagens.append(produto.__dict__)

    return produtos_com_imagens


# DELETAR produto
@app.delete('/produtos/{produto_id}', status_code=status.HTTP_204_NO_CONTENT, tags=['Produto'])
def excluir_produto(produto_id: int, session: Session = Depends(get_db)):
    repo_produto = RepositorioProduto(session)
    produto_existente = repo_produto.obter_por_id(produto_id)

    if produto_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    repo_produto.excluir(produto_existente)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.headers["X-Message"] = "Produto excluído com sucesso."
    return response


@app.get("/produtos/{produto_id}/imagem", response_class=JSONResponse, tags=['Produto'])
def get_produto_image(produto_id: int, db: Session = Depends(get_db)):
    repo_produto = RepositorioProduto(db)
    produto = repo_produto.obter_por_id(produto_id)
 
    if not produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # Verifique se há imagens associadas ao produto
    if not produto.imagens:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Imagens não encontradas para este produto.")

    # Separe as URLs das imagens
    image_urls = [url.strip() for url in produto.imagens.split(',')]

    # Verifique se os arquivos de imagem existem
    existing_image_urls = []
    for image_url in image_urls:
        if os.path.exists(image_url):
            existing_image_urls.append(image_url)

    if not existing_image_urls:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Arquivos de imagem não encontrados.")

    # Retorne todas as URLs das imagens como resposta
    return JSONResponse(content={"image_urls": existing_image_urls})

# Editar produto
@app.put("/produtos/{produto_id}/", status_code=status.HTTP_200_OK, tags=['Produto'])
async def update_produto(
    produto_id: int,
    produto_data: ProdutoEdit,  # Aceita atributos do produto em JSON
    db: Session = Depends(get_db)
):
    # Verifique se o produto com o ID especificado existe
    repo_produto = RepositorioProduto(db)
    db_produto = repo_produto.obter_por_id(produto_id)

    if not db_produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # Atualize os atributos do produto com os dados fornecidos em JSON
    for attr, value in produto_data.dict().items():
        setattr(db_produto, attr, value)

    # Atualize o produto no banco de dados
    db.commit()
    db.refresh(db_produto)

    return db_produto




from typing import List

from typing import List

@app.patch("/produtos/{produto_id}/imagem/", status_code=status.HTTP_200_OK, tags=['Produto'])
async def update_produto_images(
    produto_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Verifique se o produto com o ID especificado existe
    repo_produto = RepositorioProduto(db)
    db_produto = repo_produto.obter_por_id(produto_id)

    if not db_produto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # Processar e salvar cada arquivo
    imagens = db_produto.imagens.split(',') if db_produto.imagens else []

    for file in files:
        new_filename = f"{uuid.uuid4()}.jpg"
        
        contents = await file.read()
        with open(os.path.join(IMAGEDIR, new_filename), "wb") as f:
            f.write(contents)

        # Adicionar a URL da imagem à lista de imagens
        imagens.append(os.path.join(IMAGEDIR, new_filename))

    # Atualize a coluna 'imagens' no banco de dados com as URLs das imagens separadas por vírgula
    db_produto.imagens = ','.join(imagens)

    # Atualize o produto no banco de dados
    db.commit()
    db.refresh(db_produto)

    return db_produto



    



@app.put('/produto/ativar/{produto_id}', status_code=status.HTTP_200_OK, tags=['Produto'])
def ativar_produto(produto_id: int, session: Session = Depends(get_db)):
    repo_produto = RepositorioProduto(session)
    produto_existente = repo_produto.obter_por_id(produto_id)

    if produto_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # Ativa o produto
    produto_existente.status = True
    session.commit()

    return {"message": "Produto ativado com sucesso!"}


@app.put('/produto/desativar/{produto_id}', status_code=status.HTTP_200_OK, tags=['Produto'])
def desativar_produto(produto_id: int, session: Session = Depends(get_db)):
    repo_produto = RepositorioProduto(session)
    produto_existente = repo_produto.obter_por_id(produto_id)

    if produto_existente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")

    # Desativa o produto
    produto_existente.status = False
    session.commit()

    return {"message": "Produto desativado com sucesso."}
