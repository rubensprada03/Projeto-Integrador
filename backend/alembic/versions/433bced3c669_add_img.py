"""add img

Revision ID: 433bced3c669
Revises: 1739cb563648
Create Date: 2023-09-08 13:41:07.278372

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '433bced3c669'
down_revision = '1739cb563648'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('produto', sa.Column('imagens', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('produto', 'imagens')
    # ### end Alembic commands ###
