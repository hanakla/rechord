class ScoresController < ApplicationController
  before_action :set_score,  only: [:show, :edit, :update, :destroy]
  before_action :browsable?, only: [:show]
  before_action :editable?,  only: [:edit, :update, :destroy]
  before_action :impression, only: [:show]

  def index
    if params[:word].present?
      words = params[:word].split(" ")
      scores = Score.searchable.ransack(title_cont_all: words).result
    else
      scores = Score.searchable
    end
    render json: scores, include: [:user]
  end

  def show
    render json: {
      score:  @score.as_json(methods: [:favs, :views_count]),
      author: @score&.user
    }
  end

  def edit
    render json: { score: @score }
  end

  def create
    score = Score.new(score_params)
    if score.save
      render json: score
    else
      render json: score.errors.details, status: :unprocessable_entity
    end
  end

  def update
    if @score.update(score_params)
      render json: @score
    else
      render json: @score.errors.details, status: :unprocessable_entity
    end
  end

  def destroy
    if @score.deleted!
      head :ok
    else
      render json: @score.errors.full_messages, status: :unprocessable_entity
    end
  end

  def search
    if params[:word].present?
      words = params[:word].split(" ")
      scores = Score.searchable.ransack(title_cont_all: words).result
    else
      scores = []
    end
    render json: scores, include: [:user]
  end

  private

  def score_params
    params.require(:score).permit(
      :title, :content, :instrument, :beat, :bpm, :click, :status, :user_id
    )
  end

  def browsable?
    head :not_found unless @score.browsable?(current_user&.id)
  end

  def editable?
    head :forbidden unless @score.owner?(current_user&.id)
  end

  def set_score
    @score = Score.friendly.find_by(token: params[:token])
    head :not_found unless @score
  end

  def impression
    impressionist(@score, nil, unique: [:session_hash])
  end
end
