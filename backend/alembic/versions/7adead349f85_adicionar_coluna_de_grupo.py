"""adicionar coluna de grupo

Revision ID: 7adead349f85
Revises: 2c23d603d4f5
Create Date: 2023-08-23 14:43:34.351685

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7adead349f85'
down_revision = '2c23d603d4f5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('usuario', sa.Column('grupo', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('usuario', 'grupo')
    # ### end Alembic commands ###