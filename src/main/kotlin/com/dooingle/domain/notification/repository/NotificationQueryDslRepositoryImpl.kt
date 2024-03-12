package com.dooingle.domain.notification.repository

import com.dooingle.domain.notification.dto.NotificationQueryResponse
import com.dooingle.domain.notification.model.QNotification
import com.dooingle.domain.user.model.QSocialUser
import com.dooingle.domain.user.model.SocialUser
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.domain.SliceImpl
import org.springframework.stereotype.Repository

@Repository
class NotificationQueryDslRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : NotificationQueryDslRepository{
    private val notification = QNotification.notification
    private val user = QSocialUser.socialUser

    override fun getNotificationBySlice(
        user: SocialUser,
        cursor: Long?,
        pageable: Pageable
    ): Slice<NotificationQueryResponse> {
        val selectSize = pageable.pageSize + 1
        val whereClause = BooleanBuilder()
            .and(lessThanCursor(cursor))
            .and(notification.user.eq(user))
        val list = getContents(whereClause, selectSize.toLong())

        return SliceImpl(
            if (list.size < selectSize) list else list.dropLast(1),
            pageable,
            hasNextSlice(list, selectSize))
    }

    private fun lessThanCursor(cursor: Long?) = cursor?.let { notification.id.lt(it) }

    private fun hasNextSlice(list: List<NotificationQueryResponse>, selectSize: Int) = (list.size == selectSize)

    private fun getContents(whereClause: BooleanBuilder, selectSize: Long) =
        queryFactory
            .select(
                Projections.constructor(
                    NotificationQueryResponse::class.java,
                    notification.notificationType,
                    notification.resourceId
                )
            ).from(notification)
            .join(notification.user, user)
            .where(whereClause)
            .orderBy(notification.id.desc())
            .limit(selectSize)
            .fetch()
}