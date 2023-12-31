"""tabela de cliente e seus endereços

Revision ID: 5bf85a284c08
Revises: 2bd5b5095977
Create Date: 2023-10-16 19:08:38.288451

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5bf85a284c08'
down_revision = '2bd5b5095977'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cliente',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nome', sa.String(), nullable=False),
    sa.Column('cpf', sa.String(length=11), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('senha', sa.String(), nullable=False),
    sa.Column('data_nascimento', sa.Date(), nullable=False),
    sa.Column('genero', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('cpf'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_cliente_id'), 'cliente', ['id'], unique=False)
    op.create_table('endereco_entrega',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cliente_id', sa.Integer(), nullable=True),
    sa.Column('cep', sa.String(length=8), nullable=False),
    sa.Column('logradouro', sa.String(), nullable=False),
    sa.Column('numero', sa.String(), nullable=False),
    sa.Column('complemento', sa.String(), nullable=True),
    sa.Column('bairro', sa.String(), nullable=False),
    sa.Column('cidade', sa.String(), nullable=False),
    sa.Column('uf', sa.String(length=2), nullable=False),
    sa.ForeignKeyConstraint(['cliente_id'], ['cliente.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_endereco_entrega_id'), 'endereco_entrega', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_endereco_entrega_id'), table_name='endereco_entrega')
    op.drop_table('endereco_entrega')
    op.drop_index(op.f('ix_cliente_id'), table_name='cliente')
    op.drop_table('cliente')
    # ### end Alembic commands ###
