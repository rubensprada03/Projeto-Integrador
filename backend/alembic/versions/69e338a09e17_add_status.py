"""add status

Revision ID: 69e338a09e17
Revises: 433bced3c669
Create Date: 2023-09-12 16:22:21.249196

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '69e338a09e17'
down_revision = '433bced3c669'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('produto', sa.Column('status', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('produto', 'status')
    # ### end Alembic commands ###