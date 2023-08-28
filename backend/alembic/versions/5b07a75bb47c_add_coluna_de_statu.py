"""add coluna de statu

Revision ID: 5b07a75bb47c
Revises: 65235b9bee2c
Create Date: 2023-08-28 14:50:11.527270

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5b07a75bb47c'
down_revision = '65235b9bee2c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('usuario', sa.Column('status', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('usuario', 'status')
    # ### end Alembic commands ###