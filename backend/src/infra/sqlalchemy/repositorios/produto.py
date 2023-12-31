from sqlalchemy.orm import Session  
from src.schemas.schemas import ProdutoBase
from src.infra.sqlalchemy.models import models
    
class RepositorioProduto():
    
    def __init__(self, db: Session):
        self.db = db
    
    def criar(self, produto: ProdutoBase):  # Update the parameter type
        db_produto = models.Produto(
            nome=produto.nome,
            avaliacao=produto.avaliacao,
            descricao_detalhada=produto.descricao_detalhada,
            preco=produto.preco,
            status=produto.status,
            qtd_estoque=produto.qtd_estoque
        )
        self.db.add(db_produto)
        self.db.commit()
        self.db.refresh(db_produto)
        return db_produto
    
    def listar(self):
        produtos = self.db.query(models.Produto).all()
        return produtos  
    
    def excluir(self, produto: models.Produto):
        self.db.delete(produto)  
        self.db.commit()
    
    def obter_por_id(self, produto_id: int):
        return self.db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    
    def associar_imagem_a_produto(self, produto: models.Produto, imagem_url: str):
        produto.imagens.append(imagem_url)
        self.db.commit()
        self.db.refresh(produto)
        return produto
    
    def ativar_produto(self, produto: models.Produto):
        produto.status = True
        self.session.commit()
    
    def desativar_produto(self, produto: models.Produto):
        produto.status = False
        self.session.commit()
    